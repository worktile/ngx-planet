import { PlanetRouterEvent } from '../planet.class';
import { PlanetPortalApplication } from './portal-application';
import { NgModuleRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';

declare const window: any;
export interface GlobalPlanet {
    apps: { [key: string]: PlanetApplicationRef };
    portalApplication: PlanetPortalApplication;
}

const globalPlanet: GlobalPlanet = (window.planet = window.planet || {
    apps: {}
});

export type BootstrapAppModule = (portalApp?: PlanetPortalApplication) => Promise<NgModuleRef<any>>;

export class PlanetApplicationRef {
    private appModuleRef: NgModuleRef<any>;
    private get bootstrapped() {
        return !!this.appModuleRef;
    }
    private name: string;
    private portalApp: PlanetPortalApplication;
    private appModuleBootstrap: (app: PlanetPortalApplication) => Promise<NgModuleRef<any>>;

    constructor(name: string, appModuleBootstrap: (app: PlanetPortalApplication) => Promise<NgModuleRef<any>>) {
        this.name = name;
        this.appModuleBootstrap = appModuleBootstrap;
    }

    bootstrap(app: PlanetPortalApplication): Promise<void> {
        if (!this.appModuleBootstrap) {
            throw new Error(`${this.name} app is not define`);
        }
        this.portalApp = app;
        return this.appModuleBootstrap(app).then(appModuleRef => {
            this.appModuleRef = appModuleRef;
            return;
        });
    }

    onRouteChange(event: PlanetRouterEvent): void {
        const ngZone = this.appModuleRef.injector.get(NgZone);
        const router = this.appModuleRef.injector.get(Router);
        ngZone.run(() => {
            router.navigateByUrl(event.url);
        });
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

export { globalPlanet };
