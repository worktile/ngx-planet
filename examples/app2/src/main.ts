import { enableProdMode, NgModuleRef, Type, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Router } from '@angular/router';
import { PlanetPortalApplication, PlanetRouterEvent, GlobalEventDispatcher, defineApplication } from 'ngx-planet';

if (environment.production) {
    enableProdMode();
}

// 测试沙箱模拟APP2 引入低版本的 lodash
window['lodash'] = {
    version: '1.0.0'
};

defineApplication('app2', {
    template: `<app2-root></app2-root>`,
    bootstrap: (portalApp: PlanetPortalApplication) => {
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
    }
});
