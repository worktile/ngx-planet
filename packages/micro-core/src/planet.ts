import { Injectable, NgZone, ApplicationRef, Injector } from '@angular/core';
import { NavigationEnd, RouterEvent, Router } from '@angular/router';
import { AssetsLoader, AssetsLoadResult } from './lib/assets-loader';
import { MicroHostApplication } from './lib/host-application';
import { GlobalEventDispatcher } from './lib/global-event-dispatcher';
import { getHTMLElement, coerceArray } from './lib/helpers';
import { of, Observable, BehaviorSubject, Subject, Observer } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { IPlanetApplicationRef, SwitchModes, MicroRouterEvent, PlanetOptions, PlanetApplication } from './planet.class';
import { PlanetApplicationService } from './planet-application.service';

interface InternalPlanetApplication extends PlanetApplication {
    loaded?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class Planet {
    private options: PlanetOptions;

    private currentApp: InternalPlanetApplication;

    private hostApp = new MicroHostApplication();

    private firstLoad = true;

    public loadingDone: boolean;

    // public appLoad$ = new Subject<IPlanetApplicationRef>();

    private switchModeIsCoexist() {
        return this.options.switchMode === SwitchModes.coexist;
    }

    private getPlanetApplicationRef(app: InternalPlanetApplication): IPlanetApplicationRef {
        const appInstance = (window as any)[app.name] as { app: IPlanetApplicationRef };
        return appInstance && appInstance.app;
    }

    private hideApplication(planetApp: InternalPlanetApplication) {
        const appRootElement = document.querySelector(planetApp.selector);
        if (appRootElement) {
            appRootElement.setAttribute('style', 'display:none;');
        }
    }

    private showApplication(planetApp: InternalPlanetApplication) {
        const appRootElement = document.querySelector(planetApp.selector);
        if (appRootElement) {
            appRootElement.setAttribute('style', '');
        }
    }

    constructor(
        private assetsLoader: AssetsLoader,
        private ngZone: NgZone,
        private router: Router,
        private globalEventDispatcher: GlobalEventDispatcher,
        private applicationRef: ApplicationRef,
        private planetApplicationService: PlanetApplicationService
    ) {
        this.hostApp.ngZone = ngZone;
        this.hostApp.router = router;

        this.hostApp.globalEventDispatcher = globalEventDispatcher;
        this.options = {
            switchMode: SwitchModes.default,
            preload: true,
            errorHandler: (error: Error) => {
                console.error(error);
            }
        };
    }

    setOptions(options: Partial<PlanetOptions>) {
        this.options = {
            ...this.options,
            ...options
        };
    }

    registerApp(app: PlanetApplication | PlanetApplication[]) {
        this.planetApplicationService.register(app);
    }

    loadApp(app: InternalPlanetApplication): Observable<AssetsLoadResult[]> {
        if (app.loaded) {
            return of([]);
        }
        let scripts = app.scripts;
        if (app.scriptPathPrefix) {
            scripts = scripts.map(script => {
                return `${app.scriptPathPrefix}/${script}`;
            });
        }
        return this.assetsLoader.loadScripts(scripts);
    }

    bootstrapApp(planetApp: InternalPlanetApplication): IPlanetApplicationRef {
        const appRef = this.getPlanetApplicationRef(planetApp);
        if (appRef && appRef.bootstrap) {
            const container = getHTMLElement(planetApp.host);
            if (container) {
                let appRootElement = container.querySelector(planetApp.selector);
                if (!appRootElement) {
                    appRootElement = document.createElement(planetApp.selector);
                    if (planetApp.hostClass) {
                        appRootElement.classList.add(...coerceArray(planetApp.hostClass));
                    }
                    container.appendChild(appRootElement);
                }
            }
            appRef.bootstrap(this.hostApp);
            return appRef;
        }
        return null;
    }

    preloadAndBootstrapApp(planetApp: InternalPlanetApplication) {
        return new Promise((resolve, reject) => {
            this.ngZone.runOutsideAngular(() => {
                if (planetApp.loaded) {
                    return;
                } else {
                    this.loadApp(planetApp).subscribe(
                        result => {
                            this.bootstrapApp(planetApp);
                            this.hideApplication(planetApp);
                            planetApp.loaded = true;
                            resolve();
                        },
                        error => {
                            this.options.errorHandler(error);
                            this.applicationRef.tick();
                            reject(error);
                        }
                    );
                }
            });
        });
    }

    loadAndBootstrapApp(planetApp: InternalPlanetApplication, event?: MicroRouterEvent) {
        return new Promise((resolve, reject) => {
            this.ngZone.runOutsideAngular(() => {
                this.loadingDone = false;
                this.currentApp = planetApp;
                if (planetApp.loaded) {
                    if (this.switchModeIsCoexist()) {
                        this.showApplication(planetApp);
                        const appRef = this.getPlanetApplicationRef(planetApp);
                        appRef.onRouteChange(event);
                    } else {
                        this.bootstrapApp(planetApp);
                    }
                    resolve();
                } else {
                    this.loadApp(planetApp).subscribe(
                        result => {
                            this.bootstrapApp(planetApp);
                            planetApp.loaded = true;
                            this.loadingDone = true;
                            resolve();
                        },
                        error => {
                            this.options.errorHandler(error);
                            this.applicationRef.tick();
                            reject(error);
                        }
                    );
                }
            });
        });
    }

    destroyApp(planetApp: InternalPlanetApplication) {
        const appRef = this.getPlanetApplicationRef(planetApp);
        if (appRef) {
            appRef.destroy();
        }
        const container = getHTMLElement(planetApp.host);
        const appRootElement = container.querySelector(planetApp.selector);
        if (appRootElement) {
            container.removeChild(appRootElement);
        }
    }

    resetRouting(event: MicroRouterEvent) {
        const matchedApps = this.planetApplicationService.getAppsByMatchedUrl(event.url);
        const matchedApp = this.planetApplicationService.getAppByMatchedUrl(event.url);

        if (this.currentApp) {
            if (this.switchModeIsCoexist()) {
                const appRef = this.getPlanetApplicationRef(this.currentApp);
                if (appRef) {
                    this.hideApplication(this.currentApp);
                    appRef.onRouteChange(event);
                }
            } else {
                this.destroyApp(this.currentApp);
            }
            this.currentApp = null;
        }

        if (matchedApp) {
            this.loadAndBootstrapApp(matchedApp, event).then(() => {
                this.preloadApps(matchedApp);
            });
        } else {
            this.preloadApps();
        }
    }

    preloadApps(matchedApp?: InternalPlanetApplication) {
        if (this.firstLoad) {
            setTimeout(() => {
                const toPreloadApps = this.planetApplicationService.getAppsToPreload(
                    matchedApp ? [matchedApp.name] : null
                );
                toPreloadApps.forEach(preloadApp => {
                    this.preloadAndBootstrapApp(preloadApp).then(() => {}, error => {});
                });
            });
            this.firstLoad = true;
        }
    }
}
