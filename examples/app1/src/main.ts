import { enableProdMode, NgModuleRef, Type, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Router } from '@angular/router';
import { PlanetPortalApplication, defineApplication } from '../../../packages/micro-core/src/public_api';
import { GlobalEventDispatcher } from '../../../packages/micro-core/src/global-event-dispatcher';
import { IPlanetApplicationRef, PlanetRouterEvent } from '../../../packages/micro-core/src/planet.class';

if (environment.production) {
    enableProdMode();
}

defineApplication('app1', (hostApp: PlanetPortalApplication) => {
    return platformBrowserDynamic([
        {
            provide: PlanetPortalApplication,
            useValue: hostApp
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
