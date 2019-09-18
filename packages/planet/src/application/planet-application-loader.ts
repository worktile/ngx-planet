import { Injectable, NgZone, ApplicationRef, Injector } from '@angular/core';
import { of, Observable, Subject, forkJoin, throwError } from 'rxjs';
import { AssetsLoader, AssetsLoadResult } from '../assets-loader';
import { PlanetApplication, PlanetRouterEvent, SwitchModes, PlanetOptions } from '../planet.class';
import { switchMap, finalize, share, map, tap, delay, take, filter, catchError } from 'rxjs/operators';
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
    bootstrapped = 4,
    loadError = 10
}

@Injectable({
    providedIn: 'root'
})
export class PlanetApplicationLoader {
    private firstLoad = true;

    private startRouteChangeEvent: PlanetRouterEvent;

    private options: PlanetOptions;

    private inProgressAppAssetsLoads = new Map<string, Observable<PlanetApplication>>();

    private appsStatus = new Map<PlanetApplication, ApplicationStatus>();

    private portalApp = new PlanetPortalApplication();

    private routeChange$ = new Subject<PlanetRouterEvent>();

    private appStatusChange$ = new Subject<{ app: PlanetApplication; status: ApplicationStatus }>();

    public get appStatusChange(): Observable<{ app: PlanetApplication; status: ApplicationStatus }> {
        return this.appStatusChange$.asObservable();
    }

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
                // Using switchMap so we cancel executing loading when a new one comes in
                switchMap(event => {
                    // Return new observable use of and catchError,
                    // in order to prevent routeChange$ completed which never trigger new route change
                    return of(event).pipe(
                        // unload apps and return should load apps
                        map(() => {
                            this.loadingDone = false;
                            this.startRouteChangeEvent = event;
                            const shouldLoadApps = this.planetApplicationService.getAppsByMatchedUrl(event.url);
                            const shouldUnloadApps = this.getUnloadApps(shouldLoadApps);
                            this.unloadApps(shouldUnloadApps, event);
                            return shouldLoadApps;
                        }),
                        // Load app assets (static resources)
                        switchMap(shouldLoadApps => {
                            if (shouldLoadApps && shouldLoadApps.length > 0) {
                                const loadApps$ = shouldLoadApps.map(app => {
                                    const appStatus = this.appsStatus.get(app);
                                    if (
                                        !appStatus ||
                                        appStatus === ApplicationStatus.assetsLoading ||
                                        appStatus === ApplicationStatus.loadError
                                    ) {
                                        return this.ngZone.runOutsideAngular(() => {
                                            return this.startLoadAppAssets(app);
                                        });
                                    } else {
                                        return of(app);
                                    }
                                });
                                return forkJoin(loadApps$);
                            } else {
                                return of([]);
                            }
                        }),
                        // Bootstrap or show apps
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
                            this.ngZone.onStable
                                .asObservable()
                                .pipe(take(1))
                                .subscribe(() => {
                                    // 此处判断是因为如果静态资源加载完毕还未启动被取消，还是会启动之前的应用，虽然可能性比较小，但是无法排除这种可能性，所以只有当 Event 是最后一个才会启动
                                    if (this.startRouteChangeEvent === event) {
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
                                    }
                                });

                            return apps;
                        }),
                        // Start preload apps
                        tap(activeApps => {
                            // 第一次加载，预加载
                            if (this.firstLoad) {
                                this.preloadApps(activeApps);
                                this.firstLoad = false;
                            }
                        }),
                        // Finish loadingDone true
                        finalize(() => {
                            this.loadingDone = true;
                        }),
                        // Error handler
                        catchError(error => {
                            this.errorHandler(error);
                            return [];
                        })
                    );
                })
            )
            .subscribe();
    }

    private startLoadAppAssets(app: PlanetApplication) {
        if (this.inProgressAppAssetsLoads.get(app.name)) {
            return this.inProgressAppAssetsLoads.get(app.name);
        } else {
            const loadApp$ = this.assetsLoader.loadAppAssets(app).pipe(
                tap(() => {
                    this.inProgressAppAssetsLoads.delete(app.name);
                    this.setAppStatus(app, ApplicationStatus.assetsLoaded);
                }),
                map(() => {
                    return app;
                }),
                catchError(error => {
                    this.inProgressAppAssetsLoads.delete(app.name);
                    this.setAppStatus(app, ApplicationStatus.loadError);
                    throw error;
                }),
                share()
            );
            this.inProgressAppAssetsLoads.set(app.name, loadApp$);
            this.setAppStatus(app, ApplicationStatus.assetsLoading);
            return loadApp$;
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
                error: err => this.errorHandler(err)
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
        if (!status || status === ApplicationStatus.loadError) {
            return this.startLoadAppAssets(app).pipe(
                map(() => {
                    this.ngZone.runOutsideAngular(() => {
                        this.ngZone.onStable
                            .asObservable()
                            .pipe(take(1))
                            .subscribe(() => {
                                this.bootstrapApp(app, 'hidden');
                            });
                    });
                    return getPlanetApplicationRef(app.name);
                })
            );
        } else if (status === ApplicationStatus.assetsLoading || status === ApplicationStatus.bootstrapping) {
            return this.appStatusChange.pipe(
                filter(event => {
                    return event.app === app && event.status === ApplicationStatus.bootstrapped;
                }),
                take(1),
                map(() => {
                    return getPlanetApplicationRef(app.name);
                })
            );
        } else {
            return of(getPlanetApplicationRef(app.name));
        }
    }
}
