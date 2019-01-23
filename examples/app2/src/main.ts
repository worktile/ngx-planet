import { enableProdMode, NgModuleRef, Type, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Router } from '@angular/router';
import {
    IPlanetApplicationRef,
    PlanetPortalApplication,
    PlanetRouterEvent,
    GlobalEventDispatcher,
    defineApplication
} from '../../../packages/planet/src/public_api';

if (environment.production) {
    enableProdMode();
}

defineApplication('app2', (portalApp: PlanetPortalApplication) => {
    return platformBrowserDynamic([
        {
            provide: PlanetPortalApplication,
            useValue: portalApp
        }
    ])
        .bootstrapModule(AppModule)
        .then(appModule => {
            return appModule;
        })
        .catch(error => {
            console.error(error);
            return null;
        });
});
