import { Injectable, NgZone, ApplicationRef, Injector } from '@angular/core';
import { NavigationEnd, RouterEvent, Router } from '@angular/router';
import { AssetsLoader, AssetsLoadResult } from './assets-loader';
import { GlobalEventDispatcher } from './global-event-dispatcher';
import { getHTMLElement, coerceArray, getResourceFileName } from './helpers';
import { of, Observable, BehaviorSubject, Subject, Observer } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { SwitchModes, PlanetRouterEvent, PlanetOptions, PlanetApplication } from './planet.class';
import { PlanetApplicationService } from './application/planet-application.service';
import { PlanetPortalApplication } from './application/portal-application';
import { PlanetApplicationRef } from './application/planet-application-ref';

interface InternalPlanetApplication extends PlanetApplication {
    loaded?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class Planet {
    private options: PlanetOptions;

    private currentApp: InternalPlanetApplication;

    private portalApp = new PlanetPortalApplication();

    private firstLoad = true;

    public loadingDone = true;

    private setLoadingDoneInNgZone(loadingDone: boolean) {
        this.ngZone.run(() => {
            this.loadingDone = loadingDone;
        });
    }

    private switchModeIsCoexist(app?: InternalPlanetApplication) {
        if (app && app.switchMode) {
            return app.switchMode === SwitchModes.coexist;
        } else {
            return this.options.switchMode === SwitchModes.coexist;
        }
    }

    private getPlanetApplicationRef(app: InternalPlanetApplication): PlanetApplicationRef {
        const planet = (window as any).planet;
        if (planet && planet.apps && planet.apps[app.name]) {
            return planet.apps[app.name];
        } else {
            return null;
        }
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

    private combineResourceFilePath(resourceFilePath: string, manifestResult: { [key: string]: string }) {
        const fileName = getResourceFileName(resourceFilePath);
        if (manifestResult[fileName]) {
            return resourceFilePath.replace(fileName, manifestResult[fileName]);
        } else {
            return resourceFilePath;
        }
    }

    private getScriptsAndStylesFullPaths(app: InternalPlanetApplication, manifestResult?: { [key: string]: string }) {
        let scripts = app.scripts || [];
        let styles = app.styles || [];
        // combine resource path by manifest
        if (manifestResult) {
            scripts = scripts.map(script => {
                return this.combineResourceFilePath(script, manifestResult);
            });
            styles = styles.map(style => {
                return this.combineResourceFilePath(style, manifestResult);
            });
        }
        if (app.resourcePathPrefix) {
            scripts = scripts.map(script => {
                return `${app.resourcePathPrefix}${script}`;
            });
            styles = styles.map(style => {
                return `${app.resourcePathPrefix}${style}`;
            });
        }
        return {
            scripts: scripts,
            styles: styles
        };
    }

    constructor(
        private assetsLoader: AssetsLoader,
        private ngZone: NgZone,
        private router: Router,
        globalEventDispatcher: GlobalEventDispatcher,
        injector: Injector,
        private applicationRef: ApplicationRef,
        private planetApplicationService: PlanetApplicationService
    ) {
        this.portalApp.ngZone = ngZone;
        this.portalApp.applicationRef = applicationRef;
        this.portalApp.router = router;
        this.portalApp.injector = injector;
        this.portalApp.globalEventDispatcher = globalEventDispatcher;

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

    setPortalAppData<T>(data: T) {
        this.portalApp.data = data;
    }

    registerApp<TExtra>(app: PlanetApplication<TExtra>) {
        this.planetApplicationService.register(app);
    }

    registerApps<TExtra>(apps: PlanetApplication<TExtra>[]) {
        this.planetApplicationService.register(apps);
    }

    loadApp(app: InternalPlanetApplication): Observable<[AssetsLoadResult[], AssetsLoadResult[]]> {
        if (app.loaded) {
            return of(null);
        }
        if (app.manifest) {
            return this.assetsLoader
                .loadManifest(`${app.resourcePathPrefix || ''}${app.manifest}?t=${new Date().getTime()}`)
                .pipe(
                    switchMap(manifestResult => {
                        const { scripts, styles } = this.getScriptsAndStylesFullPaths(app, manifestResult);
                        return this.assetsLoader.loadScriptsAndStyles(scripts, styles, app.loadSerial);
                    })
                );
        } else {
            const { scripts, styles } = this.getScriptsAndStylesFullPaths(app);
            return this.assetsLoader.loadScriptsAndStyles(scripts, styles, app.loadSerial);
        }

        // return this.assetsLoader.loadScriptsAndStyles(scripts, styles, app.loadSerial);
    }

    bootstrapApp(planetApp: InternalPlanetApplication): PlanetApplicationRef {
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
            appRef.bootstrap(this.portalApp);
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

    loadAndBootstrapApp(planetApp: InternalPlanetApplication, event?: PlanetRouterEvent) {
        return new Promise((resolve, reject) => {
            this.ngZone.runOutsideAngular(() => {
                this.setLoadingDoneInNgZone(false);
                this.currentApp = planetApp;
                if (planetApp.loaded) {
                    if (this.switchModeIsCoexist(planetApp)) {
                        this.showApplication(planetApp);
                        const appRef = this.getPlanetApplicationRef(planetApp);
                        appRef.onRouteChange(event);
                    } else {
                        this.bootstrapApp(planetApp);
                    }
                    this.setLoadingDoneInNgZone(true);
                    resolve();
                } else {
                    this.loadApp(planetApp).subscribe(
                        result => {
                            this.bootstrapApp(planetApp);
                            planetApp.loaded = true;
                            this.setLoadingDoneInNgZone(true);
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

    resetByRoute(event: PlanetRouterEvent) {
        const matchedApp = this.planetApplicationService.getAppByMatchedUrl(event.url);
        if (this.currentApp) {
            if (this.switchModeIsCoexist(this.currentApp)) {
                const appRef = this.getPlanetApplicationRef(this.currentApp);
                if (appRef) {
                    this.hideApplication(this.currentApp);
                    // 从其他应用切换到主应用的时候会有视图卡顿现象，所以先等主应用渲染完毕后再加载其他应用
                    setTimeout(() => {
                        appRef.onRouteChange(event);
                    });
                }
            } else {
                setTimeout(() => {
                    this.destroyApp(this.currentApp);
                });
            }
            this.currentApp = null;
        }

        if (matchedApp) {
            setTimeout(() => {
                this.loadAndBootstrapApp(matchedApp, event).then(() => {
                    this.preloadApps(matchedApp);
                });
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
            }, 200);
            this.firstLoad = true;
        }
    }

    start() {
        this.router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd) {
                this.resetByRoute(event);
            }
        });
    }
}
