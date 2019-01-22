import { IPlanetApplicationRef, PlanetRouterEvent } from '../planet.class';
import { PlanetPortalApplication } from './portal-application';
import { NgModuleRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';

declare const window: any;
window.planet = window.planet || {
    apps: {}
};

export type BootstrapAppModule = (portalApp?: PlanetPortalApplication) => Promise<NgModuleRef<any>>;

export class PlanetApplicationRef implements IPlanetApplicationRef {
    private appModuleRef: NgModuleRef<any>;
    private name: string;
    private portalApp: PlanetPortalApplication;
    private appModuleBootstrap: (app: PlanetPortalApplication) => Promise<NgModuleRef<any>>;

    constructor(name: string, appModuleBootstrap: (app: PlanetPortalApplication) => Promise<NgModuleRef<any>>) {
        this.name = name;
        this.appModuleBootstrap = appModuleBootstrap;
    }

    bootstrap(app: PlanetPortalApplication): void {
        if (!this.appModuleBootstrap) {
            throw new Error(`${this.name} app is not define`);
        }
        this.portalApp = app;
        this.appModuleBootstrap(app).then(appModuleRef => {
            this.appModuleRef = appModuleRef;
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
    const appRef = new PlanetApplicationRef(name, bootstrapModule);
    window.planet.apps[name] = appRef;
}

// bootstrapApp('app1').then(()=>{
//     return
// });
