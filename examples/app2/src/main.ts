import { enableProdMode, NgModuleRef, Type, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Router } from '@angular/router';
import { IMicroApplication, MicroHostApplication, MicroRouterEvent } from '../../../packages/micro-core/src/public_api';

if (environment.production) {
    enableProdMode();
}

class MicroApp implements IMicroApplication {
    private appModuleRef: NgModuleRef<AppModule>;

    bootstrap(hostApp: MicroHostApplication) {
        platformBrowserDynamic([{ provide: MicroHostApplication, useValue: hostApp }])
            .bootstrapModule(AppModule)
            .then(appModule => {
                this.appModuleRef = appModule;
            })
            .catch(error => console.error(error));
    }

    destroy() {
        if (this.appModuleRef) {
            // const router = this.appModuleRef.injector.get(Router);
            // if (router) {
            //     router.dispose();
            // }
            this.appModuleRef.destroy();
            delete this.appModuleRef;
        }
    }

    onRouteChange(event: MicroRouterEvent): void {
        const ngZone = this.appModuleRef.injector.get(NgZone);
        const router = this.appModuleRef.injector.get(Router);
        // router.navigateByUrl(location.pathname);
        ngZone.run(() => {
            router.navigateByUrl(event.url);
        });
    }
}
export const app = new MicroApp();
// app.bootstrap();
