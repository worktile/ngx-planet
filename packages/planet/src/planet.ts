import { Injectable } from '@angular/core';
import { NavigationEnd, RouterEvent, Router } from '@angular/router';
import { PlanetOptions, PlanetApplication } from './planet.class';
import { PlanetApplicationService } from './application/planet-application.service';
import { setPortalApplicationData } from './application/planet-application-ref';
import { PlanetApplicationLoader, ApplicationStatus } from './application/planet-application-loader';

@Injectable({
    providedIn: 'root'
})
export class Planet {
    public get loadingDone() {
        return this.planetApplicationLoader.loadingDone;
    }

    constructor(
        private planetApplicationLoader: PlanetApplicationLoader,
        private router: Router,
        private planetApplicationService: PlanetApplicationService
    ) {}

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
