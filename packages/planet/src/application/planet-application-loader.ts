import { Injectable, NgZone, ApplicationRef, Injector } from '@angular/core';
import { of, Observable, Subject, forkJoin } from 'rxjs';
import { AssetsLoader, AssetsLoadResult } from '../assets-loader';
import { PlanetApplication, PlanetRouterEvent, SwitchModes, PlanetOptions } from '../planet.class';
import { switchMap, finalize, share, map, tap, delay, take } from 'rxjs/operators';
import { getScriptsAndStylesFullPaths, getHTMLElement, coerceArray } from '../helpers';
import { PlanetApplicationRef, getPlanetApplicationRef, globalPlanet } from './planet-application-ref';
import { PlanetPortalApplication } from './portal-application';
import { PlanetApplicationService } from './planet-application.service';
import { GlobalEventDispatcher } from '../global-event-dispatcher';
import { Router } from '@angular/router';

export enum ApplicationStatus {
    assetsLoading = 1,
    assetsLoaded = 2,
    bootstrapping = 3,
    bootstrapped = 4
}

@Injectable({
    providedIn: 'root'
})
export class PlanetApplicationLoader {
    private options: PlanetOptions;

    private inProgressAppLoads = new Map<string, Observable<PlanetApplication>>();

    private appsStatus = new Map<PlanetApplication, ApplicationStatus>();

    private portalApp = new PlanetPortalApplication();

    private routeChange$ = new Subject<PlanetRouterEvent>();

    private appStatusChange$ = new Subject<{ app: PlanetApplication; status: ApplicationStatus }>();

    get appStatusChange(): Observable<{ app: PlanetApplication; status: ApplicationStatus }> {
        return this.appStatusChange$.asObservable();
    }

    private firstLoad = true;

    public loadingDone = false;

    constructor(
        private assetsLoader: AssetsLoader,
        private planetApplicationService: PlanetApplicationService,
        private ngZone: NgZone,
        router: Router,
        injector: Injector,
        private applicationRef: ApplicationRef
    ) {
        this.options = {
            switchMode: SwitchModes.default,
            errorHandler: (error: Error) => {
                console.error(error);
            }
        };
        this.portalApp.ngZone = ngZone;
        this.portalApp.applicationRef = applicationRef;
        this.portalApp.router = router;
        this.portalApp.injector = injector;
        this.portalApp.globalEventDispatcher = injector.get(GlobalEventDispatcher);
        globalPlanet.portalApplication = this.portalApp;
        this.setupRouteChange();
    }

    private setAppStatus(app: PlanetApplication, status: ApplicationStatus) {
        this.appStatusChange$.next({
            app: app,
            status: status
        });
        this.appsStatus.set(app, status);
    }

    private switchModeIsCoexist(app: PlanetApplication) {
        if (app && app.switchMode) {
            return app.switchMode === SwitchModes.coexist;
        } else {
            return this.options.switchMode === SwitchModes.coexist;
        }
    }

    private errorHandler(error: Error) {
        this.options.errorHandler(error);
        this.applicationRef.tick();
    }

    private setupRouteChange() {
        this.routeChange$
            .pipe(
                switchMap(event => {
                    this.loadingDone = false;
                    const shouldLoadApps = this.planetApplicationService.getAppsByMatchedUrl(event.url);
                    const shouldUnloadApps = this.getUnloadApps(shouldLoadApps);
                    this.unloadApps(shouldUnloadApps, event);
                    if (shouldLoadApps && shouldLoadApps.length > 0) {
                        return of(shouldLoadApps).pipe(
                            switchMap(apps => {
                                const loadApps$ = apps.map(app => {
                                    const appStatus = this.appsStatus.get(app);
                                    if (!appStatus) {
                                        return this.startLoadAppAssets(app);
                                    } else {
                                        return of(app);
                                    }
                                });
                                return forkJoin(loadApps$);
                            }),
                            map(apps => {
                                const shouldBootstrapApps = [];
                                const shouldShowApps = [];
                                apps.forEach(app => {
                                    const appStatus = this.appsStatus.get(app);
                                    if (appStatus === ApplicationStatus.bootstrapped) {
                                        shouldShowApps.push(app);
                                    } else {
                                        shouldBootstrapApps.push(app);
                                    }
                                });

                                // 切换到应用后会有闪烁现象，所以使用 onStable 后启动应用
                                this.ngZone.onStable.pipe(take(1)).subscribe(() => {
                                    this.ngZone.runOutsideAngular(() => {
                                        shouldShowApps.forEach(app => {
                                            this.showApp(app);
                                            const appRef = getPlanetApplicationRef(app.name);
                                            appRef.onRouteChange(event);
                                        });

                                        shouldBootstrapApps.forEach(app => {
                                            this.bootstrapApp(app);
                                        });
                                    });
                                });

                                return apps;
                            })
                        );
                    } else {
                        return of([]);
                    }
                })
            )
            .subscribe({
                next: apps => {
                    this.loadingDone = true;
                    if (this.firstLoad) {
                        this.preloadApps(apps);
                        this.firstLoad = false;
                    }
                },
                error: error => {
                    this.errorHandler(error);
                }
            });
    }

    private startLoadAppAssets(app: PlanetApplication) {
        if (this.inProgressAppLoads.get(app.name)) {
            return this.inProgressAppLoads.get(app.name);
        } else {
            const loadApp$ = this.loadAppAssets(app).pipe(
                tap(() => {
                    this.inProgressAppLoads.delete(app.name);
                    this.setAppStatus(app, ApplicationStatus.assetsLoaded);
                }),
                map(() => {
                    return app;
                }),
                share()
            );
            this.inProgressAppLoads.set(app.name, loadApp$);
            this.setAppStatus(app, ApplicationStatus.assetsLoading);
            return loadApp$;
        }
    }

    private loadAppAssets(app: PlanetApplication): Observable<[AssetsLoadResult[], AssetsLoadResult[]]> {
        if (app.manifest) {
            return this.assetsLoader.loadManifest(`${app.manifest}?t=${new Date().getTime()}`).pipe(
                switchMap(manifestResult => {
                    const { scripts, styles } = getScriptsAndStylesFullPaths(app, manifestResult);
                    return this.assetsLoader.loadScriptsAndStyles(scripts, styles, app.loadSerial);
                })
            );
        } else {
            const { scripts, styles } = getScriptsAndStylesFullPaths(app);
            return this.assetsLoader.loadScriptsAndStyles(scripts, styles, app.loadSerial);
        }
    }

    private hideApp(planetApp: PlanetApplication) {
        const appRootElement = document.querySelector(planetApp.selector);
        if (appRootElement) {
            appRootElement.setAttribute('style', 'display:none;');
        }
    }

    private showApp(planetApp: PlanetApplication) {
        const appRootElement = document.querySelector(planetApp.selector);
        if (appRootElement) {
            appRootElement.setAttribute('style', '');
        }
    }

    private destroyApp(planetApp: PlanetApplication) {
        const appRef = getPlanetApplicationRef(planetApp.name);
        if (appRef) {
            appRef.destroy();
        }
        const container = getHTMLElement(planetApp.host);
        const appRootElement = container.querySelector(planetApp.selector);
        if (appRootElement) {
            container.removeChild(appRootElement);
        }
    }

    private bootstrapApp(
        app: PlanetApplication,
        defaultStatus: 'hidden' | 'display' = 'display'
    ): PlanetApplicationRef {
        this.setAppStatus(app, ApplicationStatus.bootstrapping);
        const appRef = getPlanetApplicationRef(app.name);
        if (appRef && appRef.bootstrap) {
            const container = getHTMLElement(app.host);
            if (container) {
                let appRootElement = container.querySelector(app.selector);
                if (!appRootElement) {
                    appRootElement = document.createElement(app.selector);
                    if (defaultStatus === 'hidden') {
                        appRootElement.setAttribute('style', 'display:none;');
                    }
                    if (app.hostClass) {
                        appRootElement.classList.add(...coerceArray(app.hostClass));
                    }
                    container.appendChild(appRootElement);
                }
            }
            appRef.bootstrap(this.portalApp);
            this.setAppStatus(app, ApplicationStatus.bootstrapped);
            return appRef;
        }
        return null;
    }

    private getUnloadApps(activeApps: PlanetApplication[]) {
        const unloadApps: PlanetApplication[] = [];
        this.appsStatus.forEach((value, app) => {
            if (value === ApplicationStatus.bootstrapped && !activeApps.find(item => item.name === app.name)) {
                unloadApps.push(app);
            }
        });
        return unloadApps;
    }

    private unloadApps(shouldUnloadApps: PlanetApplication[], event: PlanetRouterEvent) {
        const hideApps: PlanetApplication[] = [];
        const destroyApps: PlanetApplication[] = [];
        shouldUnloadApps.forEach(app => {
            if (this.switchModeIsCoexist(app)) {
                hideApps.push(app);
                this.hideApp(app);
                this.setAppStatus(app, ApplicationStatus.bootstrapped);
            } else {
                destroyApps.push(app);
                // 销毁之前先隐藏，否则会出现闪烁，因为 destroy 是延迟执行的
                // 如果销毁不延迟执行，会出现切换到主应用的时候会有视图卡顿现象
                this.hideApp(app);
                this.setAppStatus(app, ApplicationStatus.assetsLoaded);
            }
        });

        // 从其他应用切换到主应用的时候会有视图卡顿现象，所以先等主应用渲染完毕后再加载其他应用
        // 此处尝试使用 this.ngZone.onStable.pipe(take(1)) 应用之间的切换会出现闪烁
        setTimeout(() => {
            hideApps.forEach(app => {
                const appRef = getPlanetApplicationRef(app.name);
                if (appRef) {
                    appRef.onRouteChange(event);
                }
            });
            destroyApps.forEach(app => {
                this.destroyApp(app);
            });
        });
    }

    private preloadApps(activeApps?: PlanetApplication[]) {
        setTimeout(() => {
            const toPreloadApps = this.planetApplicationService.getAppsToPreload(
                activeApps ? activeApps.map(item => item.name) : null
            );
            const loadApps$ = toPreloadApps.map(preloadApp => {
                return this.preload(preloadApp);
            });
            forkJoin(loadApps$).subscribe({
                error: this.errorHandler
            });
        });
    }

    setOptions(options: Partial<PlanetOptions>) {
        this.options = {
            ...this.options,
            ...options
        };
    }

    /**
     * reset route by current router
     */
    reroute(event: PlanetRouterEvent) {
        this.routeChange$.next(event);
    }

    /**
     * Preload planet application
     * @param app app
     */
    preload(app: PlanetApplication): Observable<PlanetApplicationRef> {
        const status = this.appsStatus.get(app);
        if (!status || status === ApplicationStatus.assetsLoading) {
            return this.startLoadAppAssets(app).pipe(
                map(() => {
                    this.ngZone.runOutsideAngular(() => {
                        this.bootstrapApp(app, 'hidden');
                    });
                    return getPlanetApplicationRef(app.name);
                })
            );
        }
        return of(getPlanetApplicationRef(app.name));
    }
}
