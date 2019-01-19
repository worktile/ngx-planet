import { NgModule, InjectionToken } from '@angular/core';
import { GlobalEventDispatcher } from './lib/global-event-dispatcher';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { PlanetApplication } from './planet.class';

const PLANET_APPLICATIONS = new InjectionToken<PlanetApplication>('PLANET_APPLICATIONS');

@NgModule({
    declarations: [],
    imports: [],
    providers: [GlobalEventDispatcher],
    exports: []
})
export class NgxPlanetModule {
    static forRoot(apps: PlanetApplication[]): ModuleWithProviders {
        return {
            ngModule: NgxPlanetModule,
            providers: [
                {
                    provide: PLANET_APPLICATIONS,
                    useValue: apps
                }
            ]
        };
    }
}
