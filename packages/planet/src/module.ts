import { NgModule, InjectionToken, ModuleWithProviders } from '@angular/core';
import { GlobalEventDispatcher } from './global-event-dispatcher';
import { PlanetApplication, PLANET_APPLICATIONS } from './planet.class';
import { HttpClientModule } from '@angular/common/http';
import { EmptyComponent } from './empty/empty.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [EmptyComponent],
    entryComponents: [EmptyComponent],
    imports: [HttpClientModule],
    providers: [],
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
