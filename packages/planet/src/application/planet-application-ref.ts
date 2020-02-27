import { PlanetRouterEvent, PlanetApplication } from '../planet.class';
import { PlanetPortalApplication } from './portal-application';
import { NgModuleRef, NgZone, ApplicationRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { PlantComponentConfig } from '../component/plant-component.config';
import { PlanetComponentRef } from '../component/planet-component-ref';
import { take } from 'rxjs/operators';
import { Observable, from } from 'rxjs';

declare const window: any;
export interface GlobalPlanet {
    apps: { [key: string]: PlanetApplicationRef };
    registerApps: PlanetApplication[];
    portalApplication: PlanetPortalApplication;
}

const globalPlanet: GlobalPlanet = (window.planet = window.planet || {
    apps: {},
    registerApps: []
});

export type BootstrapAppModule = (portalApp?: PlanetPortalApplication) => Promise<NgModuleRef<any>>;

export type PlantComponentFactory = <TData>(
    componentName: string,
    config: PlantComponentConfig<TData>
) => PlanetComponentRef<TData>;

export class PlanetApplicationRef {
    public appModuleRef: NgModuleRef<any>;
    private get bootstrapped() {
        return !!this.appModuleRef;
    }
    private name: string;
    private portalApp: PlanetPortalApplication;
    private appModuleBootstrap: (app: PlanetPortalApplication) => Promise<NgModuleRef<any>>;
    private componentFactory: PlantComponentFactory;

    constructor(name: string, appModuleBootstrap: (app: PlanetPortalApplication) => Promise<NgModuleRef<any>>) {
        this.name = name;
        this.appModuleBootstrap = appModuleBootstrap;
    }

    // 子应用路由变化后同步修改 portal 的 Route
    private syncPortalRouteWhenNavigationEnd() {
        const router = this.appModuleRef.injector.get(Router);
        const ngZone = this.appModuleRef.injector.get(NgZone);
        if (router) {
            router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    ngZone.onStable
                        .asObservable()
                        .pipe(take(1))
                        .subscribe(() => {
                            this.portalApp.router.navigateByUrl(event.url);
                        });
                }
            });
        }
    }

    bootstrap(app: PlanetPortalApplication): Observable<this> {
        if (!this.appModuleBootstrap) {
            throw new Error(`${this.name} app is not define`);
        }
        this.portalApp = app;
        return from(
            this.appModuleBootstrap(app).then(appModuleRef => {
                this.appModuleRef = appModuleRef;
                this.appModuleRef.instance.appName = this.name;
                this.syncPortalRouteWhenNavigationEnd();
                return this;
            })
        );
    }

    getRouter() {
        return this.appModuleRef.injector.get(Router);
    }

    getCurrentRouterStateUrl() {
        return this.getRouter().routerState.snapshot.url;
    }

    navigateByUrl(url: string): void {
        const ngZone = this.appModuleRef.injector.get(NgZone);
        const router = this.getRouter();
        ngZone.run(() => {
            router.navigateByUrl(url);
        });
    }

    getComponentFactory() {
        return this.componentFactory;
    }

    registerComponentFactory(componentFactory: PlantComponentFactory) {
        this.componentFactory = componentFactory;
    }

    destroy(): void {
        if (this.appModuleRef) {
            const router = this.appModuleRef.injector.get(Router);
            if (router) {
                router.dispose();
            }
            this.appModuleRef.destroy();
            delete this.appModuleRef;
        }
    }
}

export function defineApplication(name: string, bootstrapModule: BootstrapAppModule) {
    if (window.planet.apps[name]) {
        throw new Error(`${name} application has exist.`);
    }
    const appRef = new PlanetApplicationRef(name, bootstrapModule);
    window.planet.apps[name] = appRef;
}

export function getPlanetApplicationRef(appName: string): PlanetApplicationRef {
    const planet = (window as any).planet;
    if (planet && planet.apps && planet.apps[appName]) {
        return planet.apps[appName];
    } else {
        return null;
    }
}

export function setPortalApplicationData<T>(data: T) {
    globalPlanet.portalApplication.data = data;
}

export function getPortalApplicationData<TData>(): TData {
    return globalPlanet.portalApplication.data as TData;
}

export { globalPlanet };
