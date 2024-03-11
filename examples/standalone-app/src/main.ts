import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppRootComponent } from './app/app.component';
import { defineApplication, PlanetPortalApplication } from '@worktile/planet';
import { AppRootContext } from '../../common';

defineApplication('standalone-app', {
    template: `<standalone-app-root></standalone-app-root>`,
    bootstrap: (portalApp: PlanetPortalApplication) => {
        appConfig.providers.push([
            {
                provide: PlanetPortalApplication,
                useValue: portalApp
            },
            {
                provide: AppRootContext,
                useValue: portalApp.data.appRootContext
            }
        ]);
        return bootstrapApplication(AppRootComponent, appConfig).catch(error => {
            console.error(error);
            return null;
        });
    }
});

// bootstrapApplication(AppRootComponent, appConfig);
