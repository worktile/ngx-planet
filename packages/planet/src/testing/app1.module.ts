import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlanetComponentLoader } from '../component/planet-component-loader';
import { PlanetApplicationLoader } from '../application/planet-application-loader';

export const app1Name = 'app1';

@Component({
    selector: 'app1-projects',
    template: `
        projects is work
    `
})
export class App1ProjectsComponent {}

@NgModule({
    declarations: [App1ProjectsComponent],
    entryComponents: [App1ProjectsComponent],
    imports: [RouterModule.forChild([])],
    providers: [
        PlanetComponentLoader,
        {
            provide: PlanetApplicationLoader,
            useValue: {
                preload: () => {}
            }
        }
    ]
})
export class App1Module {
    constructor(private componentLoader: PlanetComponentLoader) {
        // componentLoader.register([{ name: 'app1-projects', component: App1ProjectsComponent }]);
    }
}
