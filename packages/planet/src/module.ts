import { NgModule, ModuleWithProviders } from '@angular/core';
import { PlanetApplication, PLANET_APPLICATIONS } from './planet.class';
import { HttpClientModule } from '@angular/common/http';
import { EmptyComponent } from './empty/empty.component';
import { PlanetComponentOutlet } from './component/planet-component-outlet';

@NgModule({
    declarations: [EmptyComponent, PlanetComponentOutlet],
    imports: [HttpClientModule],
    providers: [],
    exports: [HttpClientModule, EmptyComponent, PlanetComponentOutlet]
})
export class NgxPlanetModule {
    static forRoot(apps: PlanetApplication[]): ModuleWithProviders<NgxPlanetModule> {
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
