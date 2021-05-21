import { Injectable, NgZone, ApplicationRef, Injector } from '@angular/core';
import { of, Observable, Subject, forkJoin, from } from 'rxjs';
import { AssetsLoader } from '../assets-loader';
import { PlanetApplication, PlanetRouterEvent, SwitchModes, PlanetOptions } from '../planet.class';
import { switchMap, share, map, tap, distinctUntilChanged, take, filter, catchError } from 'rxjs/operators';
import { getHTMLElement, coerceArray, createElementByTemplate } from '../helpers';
import { PlanetApplicationRef } from './planet-application-ref';
import { PlanetPortalApplication } from './portal-application';
import { PlanetApplicationService } from './planet-application.service';
import { GlobalEventDispatcher } from '../global-event-dispatcher';
import { Router } from '@angular/router';
import { globalPlanet, getPlanetApplicationRef, getApplicationLoader } from '../global-planet';
import { createDebug } from '../debug';
const debug = createDebug('app-loader');

export enum ApplicationStatus {
    assetsLoading = 1,
    assetsLoaded = 2,
    bootstrapping = 3,
    bootstrapped = 4,
    active = 5,
    loadError = 10
}

export interface AppsLoadingStartEvent {
    shouldLoadApps: PlanetApplication[];
    shouldUnloadApps: PlanetApplication[];
}

export interface AppStatusChangeEvent {
    app: PlanetApplication;
    status: ApplicationStatus;
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

    private appStatusChange$ = new Subject<AppStatusChangeEvent>();

    private appsLoadingStart$ = new Subject<AppsLoadingStartEvent>();

    public get appStatusChange(): Observable<AppStatusChangeEvent> {
        return this.appStatusChange$.asObservable();
    }

    public get appsLoadingStart(): Observable<AppsLoadingStartEvent> {
        return this.appsLoadingStart$.asObservable();
    }

    public loadingDone = false;

    constructor(
        private assetsLoader: AssetsLoader,
        private planetApplicationService: PlanetApplicationService,
        private ngZone: NgZone,
        router: Router,
        injector: Injector,
        applicationRef: ApplicationRef
    ) {
        if (getApplicationLoader()) {
            throw new Error(
                'PlanetApplicationLoader has been injected in the portal, repeated injection is not allowed'
            );
        }

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
        this.ngZone.run(() => {
            const fromStatus = this.appsStatus.get(app);
            debug(
                `app(${app.name}) status change: ${fromStatus ? ApplicationStatus[fromStatus] : 'empty'} => ${
                    ApplicationStatus[status]
                }`
            );
            this.appsStatus.set(app, status);
            this.appStatusChange$.next({
                app: app,
                status: status
            });
        });
    }

    private getAppStatusChange$(
        app: PlanetApplication,
        status = ApplicationStatus.bootstrapped
    ): Observable<PlanetApplication> {
        return this.appStatusChange.pipe(
            filter(event => {
                return event.app === app && event.status === status;
            }),
            map(() => {
                return app;
            })
        );
    }

    private switchModeIsCoexist(app: PlanetApplication) {
        if (app && app.switchMode) {
            return app.switchMode === SwitchModes.coexist;
        } else {
            return this.options.switchMode === SwitchModes.coexist;
        }
    }

    private errorHandler(error: Error) {
        this.ngZone.run(() => {
            this.options.errorHandler(error);
        });
    }

    private setLoadingDone() {
        this.ngZone.run(() => {
            this.loadingDone = true;
        });
    }

    private getAppNames(apps: PlanetApplication[]): string | string[] {
        return apps.length === 0
            ? `[]`
            : apps.map(item => {
                  return item.name;
              });
    }

    private setupRouteChange() {
        this.routeChange$
            .pipe(
                distinctUntilChanged((x, y) => {
                    return (x && x.url) === (y && y.url);
                }),
                // Using switchMap so we cancel executing loading when a new one comes in
                switchMap(event => {
                    // Return new observable use of and catchError,
                    // in order to prevent routeChange$ completed which never trigger new route change
                    return of(event).pipe(
                        // unload apps and return should load apps
                        map(() => {
                            debug(`route change, url is: ${event.url}`);
                            this.startRouteChangeEvent = event;
                            const shouldLoadApps = this.planetApplicationService.getAppsByMatchedUrl(event.url);
                            debug(`should load apps: ${this.getAppNames(shouldLoadApps)}`);
                            const shouldUnloadApps = this.getUnloadApps(shouldLoadApps);
                            this.appsLoadingStart$.next({
                                shouldLoadApps,
                                shouldUnloadApps
                            });
                            this.unloadApps(shouldUnloadApps, event);
                            debug(`unload apps: ${this.getAppNames(shouldUnloadApps)}`);
                            return shouldLoadApps;
                        }),
                        // Load app assets (static resources)
                        switchMap(shouldLoadApps => {
                            let hasAppsNeedLoadingAssets = false;
                            const loadApps$ = shouldLoadApps.map(app => {
                                const appStatus = this.appsStatus.get(app);
                                if (
                                    !appStatus ||
                                    appStatus === ApplicationStatus.assetsLoading ||
                                    appStatus === ApplicationStatus.loadError
                                ) {
                                    debug(
                                        `app(${app.name}) status is ${ApplicationStatus[appStatus]}, start load assets`
                                    );
                                    hasAppsNeedLoadingAssets = true;
                                    return this.ngZone.runOutsideAngular(() => {
                                        return this.startLoadAppAssets(app);
                                    });
                                } else {
                                    return of(app);
                                }
                            });
                            if (hasAppsNeedLoadingAssets) {
                                this.loadingDone = false;
                            }
                            return loadApps$.length > 0 ? forkJoin(loadApps$) : of([] as PlanetApplication[]);
                        }),
                        // Bootstrap or show apps
                        map(apps => {
                            const apps$: Observable<PlanetApplication>[] = apps.map(app => {
                                return of(app).pipe(
                                    switchMap(app => {
                                        const appStatus = this.appsStatus.get(app);
                                        if (appStatus === ApplicationStatus.bootstrapped) {
                                            debug(
                                                `[routeChange] app(${app.name}) status is bootstrapped, show app and active`
                                            );
                                            this.showApp(app);
                                            const appRef = getPlanetApplicationRef(app.name);
                                            appRef.navigateByUrl(event.url);
                                            this.setAppStatus(app, ApplicationStatus.active);
                                            this.setLoadingDone();
                                            return of(app);
                                        } else if (appStatus === ApplicationStatus.assetsLoaded) {
                                            debug(
                                                `[routeChange] app(${app.name}) status is assetsLoaded, start bootstrapping`
                                            );
                                            return this.bootstrapApp(app).pipe(
                                                map(() => {
                                                    debug(`app(${app.name}) bootstrapped success, active it`);
                                                    this.setAppStatus(app, ApplicationStatus.active);
                                                    this.setLoadingDone();
                                                    return app;
                                                })
                                            );
                                        } else if (appStatus === ApplicationStatus.active) {
                                            debug(`[routeChange] app(${app.name}) is active, do nothings`);
                                            const appRef = getPlanetApplicationRef(app.name);
                                            // Backwards compatibility sub app use old version which has not getCurrentRouterStateUrl
                                            const currentUrl = appRef.getCurrentRouterStateUrl
                                                ? appRef.getCurrentRouterStateUrl()
                                                : '';
                                            if (currentUrl !== event.url) {
                                                appRef.navigateByUrl(event.url);
                                            }
                                            return of(app);
                                        } else {
                                            debug(
                                                `[routeChange] app(${app.name}) status is ${ApplicationStatus[appStatus]}`
                                            );
                                            return this.getAppStatusChange$(app).pipe(
                                                take(1),
                                                map(() => {
                                                    debug(
                                                        `app(${app.name}) status is bootstrapped by subscribe status change, active it`
                                                    );
                                                    this.setAppStatus(app, ApplicationStatus.active);
                                                    this.showApp(app);
                                                    return app;
                                                })
                                            );
                                        }
                                    })
                                );
                            });

                            if (apps$.length > 0) {
                                debug(`start load and active apps: ${this.getAppNames(apps)}`);
                                // 切换到应用后会有闪烁现象，所以使用 setTimeout 后启动应用
                                // example: redirect to app1's dashboard from portal's about page
                                // If app's route has redirect, it doesn't work, it ok just in setTimeout, I don't know why.
                                // TODO:: remove it, it is ok in version Angular 9.x
                                setTimeout(() => {
                                    // 此处判断是因为如果静态资源加载完毕还未启动被取消，还是会启动之前的应用，虽然可能性比较小，但是无法排除这种可能性，所以只有当 Event 是最后一个才会启动
                                    if (this.startRouteChangeEvent === event) {
                                        // runOutsideAngular for fix error: `Expected to not be in Angular Zone, but it is!`
                                        this.ngZone.runOutsideAngular(() => {
                                            forkJoin(apps$).subscribe(() => {
                                                this.setLoadingDone();
                                                this.ensurePreloadApps(apps);
                                            });
                                        });
                                    }
                                });
                            } else {
                                debug(`no apps need to be loaded, ensure preload apps`);
                                this.ensurePreloadApps(apps);
                                this.setLoadingDone();
                            }
                        }),
                        // Error handler
                        catchError(error => {
                            debug(`apps loader error: ${error}`);
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
        const appRef = getPlanetApplicationRef(planetApp.name);
        const appRootElement = document.querySelector(appRef.selector || planetApp.selector);
        if (appRootElement) {
            appRootElement.setAttribute('style', 'display:none;');
        }
    }

    private showApp(planetApp: PlanetApplication) {
        const appRef = getPlanetApplicationRef(planetApp.name);
        const appRootElement = document.querySelector(appRef.selector || planetApp.selector);
        if (appRootElement) {
            appRootElement.setAttribute('style', '');
        }
    }

    private destroyApp(planetApp: PlanetApplication) {
        const appRef = getPlanetApplicationRef(planetApp.name);
        if (appRef) {
            appRef.destroy();
        }
        const container = getHTMLElement(planetApp.hostParent);
        const appRootElement = container.querySelector((appRef && appRef.selector) || planetApp.selector);
        if (appRootElement) {
            container.removeChild(appRootElement);
        }
    }

    private bootstrapApp(
        app: PlanetApplication,
        defaultStatus: 'hidden' | 'display' = 'display'
    ): Observable<PlanetApplicationRef> {
        debug(`app(${app.name}) start bootstrapping`);
        this.setAppStatus(app, ApplicationStatus.bootstrapping);
        const appRef = getPlanetApplicationRef(app.name);
        if (appRef && appRef.bootstrap) {
            const container = getHTMLElement(app.hostParent);
            let appRootElement: HTMLElement;
            if (container) {
                appRootElement = container.querySelector(appRef.selector || app.selector);
                if (!appRootElement) {
                    if (appRef.template) {
                        appRootElement = createElementByTemplate(appRef.template);
                    } else {
                        appRootElement = document.createElement(app.selector);
                    }
                    appRootElement.setAttribute('style', 'display:none;');
                    if (app.hostClass) {
                        appRootElement.classList.add(...coerceArray(app.hostClass));
                    }
                    if (app.stylePrefix) {
                        appRootElement.classList.add(...coerceArray(app.stylePrefix));
                    }
                    container.appendChild(appRootElement);
                }
            }
            let result = appRef.bootstrap(this.portalApp);
            // Backwards compatibility promise for bootstrap
            if (result['then']) {
                result = from(result) as Observable<PlanetApplicationRef>;
            }
            return result.pipe(
                tap(() => {
                    debug(`app(${app.name}) bootstrapped success for ${defaultStatus}`);
                    this.setAppStatus(app, ApplicationStatus.bootstrapped);
                    if (defaultStatus === 'display' && appRootElement) {
                        appRootElement.removeAttribute('style');
                    }
                }),
                map(() => {
                    return appRef;
                })
            );
        } else {
            throw new Error(
                `[${app.name}] not found, make sure that the app has the correct name defined use defineApplication(${app.name}) and runtimeChunk and vendorChunk are set to true, details see https://github.com/worktile/ngx-planet#throw-error-cannot-read-property-call-of-undefined-at-__webpack_require__-bootstrap79`
            );
        }
    }

    private getUnloadApps(activeApps: PlanetApplication[]) {
        const unloadApps: PlanetApplication[] = [];
        this.appsStatus.forEach((value, app) => {
            if (value === ApplicationStatus.active && !activeApps.find(item => item.name === app.name)) {
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
                debug(`hide app(${app.name}) for coexist mode`);
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

        if (hideApps.length > 0 || destroyApps.length > 0) {
            // 从其他应用切换到主应用的时候会有视图卡顿现象，所以先等主应用渲染完毕后再加载其他应用
            // 此处尝试使用 this.ngZone.onStable.pipe(take(1)) 应用之间的切换会出现闪烁
            setTimeout(() => {
                hideApps.forEach(app => {
                    const appRef = getPlanetApplicationRef(app.name);
                    if (appRef) {
                        appRef.navigateByUrl(event.url);
                    }
                });
                destroyApps.forEach(app => {
                    debug(`destroy app(${app.name})`);
                    this.destroyApp(app);
                });
            });
        }
    }

    private preloadApps(activeApps?: PlanetApplication[]) {
        setTimeout(() => {
            const toPreloadApps = this.planetApplicationService.getAppsToPreload(
                activeApps ? activeApps.map(item => item.name) : null
            );
            debug(`start preload apps: ${this.getAppNames(toPreloadApps)}`);
            const loadApps$ = toPreloadApps.map(preloadApp => {
                return this.preloadInternal(preloadApp);
            });

            forkJoin(loadApps$).subscribe({
                error: error => this.errorHandler(error)
            });
        });
    }

    private ensurePreloadApps(activeApps?: PlanetApplication[]) {
        // Start preload apps
        // Start preload when first time app loaded
        if (this.firstLoad) {
            this.preloadApps(activeApps);
            this.firstLoad = false;
        }
    }

    public setOptions(options: Partial<PlanetOptions>) {
        this.options = {
            ...this.options,
            ...options
        };
    }

    /**
     * reset route by current router
     */
    public reroute(event: PlanetRouterEvent) {
        this.routeChange$.next(event);
    }

    private preloadInternal(app: PlanetApplication, immediate?: boolean): Observable<PlanetApplicationRef> {
        const status = this.appsStatus.get(app);
        if (!status || status === ApplicationStatus.loadError) {
            debug(`preload app(${app.name}), status is empty, start to load assets`);
            return this.startLoadAppAssets(app).pipe(
                switchMap(() => {
                    debug(`preload app(${app.name}), assets loaded, start bootstrap app, immediate: ${!!immediate}`);
                    if (immediate) {
                        return this.bootstrapApp(app, 'hidden');
                    } else {
                        return this.ngZone.runOutsideAngular(() => {
                            return this.bootstrapApp(app, 'hidden');
                        });
                    }
                }),
                map(() => {
                    return getPlanetApplicationRef(app.name);
                })
            );
        } else if (
            [ApplicationStatus.assetsLoading, ApplicationStatus.assetsLoaded, ApplicationStatus.bootstrapping].includes(
                status
            )
        ) {
            debug(`preload app(${app.name}), status is ${ApplicationStatus[status]}, return until bootstrapped`);
            return this.getAppStatusChange$(app).pipe(
                take(1),
                map(() => {
                    return getPlanetApplicationRef(app.name);
                })
            );
        } else {
            const appRef = getPlanetApplicationRef(app.name);
            if (!appRef) {
                throw new Error(`${app.name}'s status is ${ApplicationStatus[status]}, planetApplicationRef is null.`);
            }
            return of(appRef);
        }
    }

    /**
     * Preload planet application
     * @param app app
     * @param immediate bootstrap on stable by default, setting immediate is true, it will bootstrap immediate
     */
    public preload(app: PlanetApplication, immediate?: boolean): Observable<PlanetApplicationRef> {
        return this.preloadInternal(app, immediate);
    }
}
