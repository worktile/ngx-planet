import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Router } from '@angular/router';

if (environment.production) {
    enableProdMode();
}

class MicroApp {
    private appModuleRef: NgModuleRef<AppModule>;

    bootstrap() {
        platformBrowserDynamic()
            .bootstrapModule(AppModule)
            .then(appModule => {
                this.appModuleRef = appModule;
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
        }
    }
}
export const app = new MicroApp();
// app.bootstrap();
