import { NgModule, ModuleWithProviders } from '@angular/core';
import { PlanetApplication, PLANET_APPLICATIONS } from './planet.class';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EmptyComponent } from './empty/empty.component';
import { PlanetComponentOutlet } from './component/planet-component-outlet';
import { RedirectToRouteComponent } from './router/route-redirect';

@NgModule({
    declarations: [],
    exports: [EmptyComponent, PlanetComponentOutlet],
    imports: [PlanetComponentOutlet, EmptyComponent, RedirectToRouteComponent],
    providers: [provideHttpClient(withInterceptorsFromDi())]
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
