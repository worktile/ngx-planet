import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppRootComponent } from './app/app.component';
import { defineApplication, PlanetPortalApplication } from '@worktile/planet';

defineApplication('standalone-app', {
    template: `<standalone-app-root></standalone-app-root>`,
    bootstrap: (portalApp: PlanetPortalApplication) => {
        return bootstrapApplication(AppRootComponent, appConfig);
    }
});

// bootstrapApplication(AppRootComponent, appConfig);
