import { NgModule, InjectionToken, ModuleWithProviders } from '@angular/core';
import { GlobalEventDispatcher } from './global-event-dispatcher';
import { PlanetApplication } from './planet.class';
import { HttpClientModule } from '@angular/common/http';
import { EmptyComponent } from './empty/empty.component';

const PLANET_APPLICATIONS = new InjectionToken<PlanetApplication>('PLANET_APPLICATIONS');

@NgModule({
    declarations: [EmptyComponent],
    imports: [HttpClientModule],
    providers: [GlobalEventDispatcher],
    exports: [HttpClientModule, EmptyComponent]
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
