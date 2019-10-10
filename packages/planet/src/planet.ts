import { Injectable, Inject, Optional } from '@angular/core';
import { NavigationEnd, RouterEvent, Router } from '@angular/router';
import { PlanetOptions, PlanetApplication, PLANET_APPLICATIONS } from './planet.class';
import { PlanetApplicationService } from './application/planet-application.service';
import { setPortalApplicationData } from './application/planet-application-ref';
import {
    PlanetApplicationLoader,
    AppsLoadingStartEvent,
    AppStatusChangeEvent
} from './application/planet-application-loader';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Planet {
    public get loadingDone() {
        return this.planetApplicationLoader.loadingDone;
    }

    public get appStatusChange(): Observable<AppStatusChangeEvent> {
        return this.planetApplicationLoader.appStatusChange;
    }

    public get appsLoadingStart(): Observable<AppsLoadingStartEvent> {
        return this.planetApplicationLoader.appsLoadingStart;
    }

    constructor(
        private planetApplicationLoader: PlanetApplicationLoader,
        private router: Router,
        private planetApplicationService: PlanetApplicationService,
        @Inject(PLANET_APPLICATIONS) @Optional() planetApplications: PlanetApplication[]
    ) {
        if (planetApplications) {
            this.registerApps(planetApplications);
        }
    }

    setOptions(options: Partial<PlanetOptions>) {
        this.planetApplicationLoader.setOptions(options);
    }

    setPortalAppData<T>(data: T) {
        setPortalApplicationData(data);
    }

    registerApp<TExtra>(app: PlanetApplication<TExtra>) {
        this.planetApplicationService.register(app);
    }

    registerApps<TExtra>(apps: PlanetApplication<TExtra>[]) {
        this.planetApplicationService.register(apps);
    }

    unregisterApp(name: string) {
        this.planetApplicationService.unregister(name);
    }

    getApps() {
        return this.planetApplicationService.getApps();
    }

    start() {
        this.router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd) {
                this.planetApplicationLoader.reroute({
                    url: event.url
                });
            }
        });
    }
}
