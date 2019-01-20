import { enableProdMode, NgModuleRef, Type, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Router } from '@angular/router';
import { MicroHostApplication } from '../../../packages/micro-core/src/lib/host-application';
import { GlobalEventDispatcher } from '../../../packages/micro-core/src/lib/global-event-dispatcher';
import { IPlanetApplicationRef, MicroRouterEvent } from '../../../packages/micro-core/src/planet.class';


if (environment.production) {
    enableProdMode();
}

// platform.mount(`app1`).then(()=>{

// });
class MicroApp implements IPlanetApplicationRef {
    private appModuleRef: NgModuleRef<AppModule>;

    bootstrap(hostApp: MicroHostApplication) {
        return platformBrowserDynamic([
            {
                provide: MicroHostApplication,
                useValue: hostApp
            },
            {
                provide: GlobalEventDispatcher,
                useValue: hostApp.globalEventDispatcher
            },
            {
                provide: NgZone,
                useValue: hostApp.ngZone
            }
        ])
            .bootstrapModule(AppModule)
            .then(appModule => {
                return this.appModuleRef = appModule;
            })
            .catch(error => console.error(error));
    }

    destroy() {
        if (this.appModuleRef) {
            const router = this.appModuleRef.injector.get(Router);
            if (router) {
                router.dispose();
            }
            this.appModuleRef.destroy();
            delete this.appModuleRef;
        }
    }

    onRouteChange(event: MicroRouterEvent) {
        const ngZone = this.appModuleRef.injector.get(NgZone);
        const router = this.appModuleRef.injector.get(Router);
        ngZone.run(() => {
            router.navigateByUrl(event.url);
        });
    }
}
export const app = new MicroApp();
// app.bootstrap();
