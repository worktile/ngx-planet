import { Component, NgModule, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlanetComponentLoader } from '../component/planet-component-loader';
import { PlanetApplicationLoader } from '../application/planet-application-loader';

export const app1Name = 'app1';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app1-projects,[app1Projects]',
    template: ` projects is work <ng-content></ng-content> `
})
export class App1ProjectsComponent implements OnDestroy {
    static state: 'initialized' | 'destroyed' | '' = '';

    constructor() {
        App1ProjectsComponent.state = 'initialized';
    }

    ngOnDestroy(): void {
        App1ProjectsComponent.state = 'destroyed';
    }
}

@NgModule({
    declarations: [App1ProjectsComponent],
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
