import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlanetApplicationLoader } from '../application/planet-application-loader';
import { PlanetComponentLoader } from '../component/planet-component-loader';

export const app2Name = 'app2';

@NgModule({
    declarations: [],
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
export class App2Module {
    constructor() {}
}
