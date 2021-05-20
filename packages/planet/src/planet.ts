import { Injectable, Inject, Optional, Injector } from '@angular/core';
import { NavigationEnd, RouterEvent, Router } from '@angular/router';
import { PlanetOptions, PlanetApplication, PLANET_APPLICATIONS } from './planet.class';
import { PlanetApplicationService } from './application/planet-application.service';
import {
    PlanetApplicationLoader,
    AppsLoadingStartEvent,
    AppStatusChangeEvent
} from './application/planet-application-loader';
import { Observable, Subscription } from 'rxjs';
import { filter, startWith, distinctUntilChanged, map } from 'rxjs/operators';
import {
    setPortalApplicationData,
    setApplicationLoader,
    setApplicationService,
    getApplicationLoader,
    getApplicationService
} from './global-planet';
import { setDebugFactory } from './debug';

@Injectable({
    providedIn: 'root'
})
export class Planet {
    private get planetApplicationLoader() {
        return getApplicationLoader();
    }

    private get planetApplicationService() {
        return getApplicationService();
    }

    public get loadingDone() {
        return this.planetApplicationLoader.loadingDone;
    }

    public get appStatusChange(): Observable<AppStatusChangeEvent> {
        return this.planetApplicationLoader.appStatusChange;
    }

    public get appsLoadingStart(): Observable<AppsLoadingStartEvent> {
        return this.planetApplicationLoader.appsLoadingStart;
    }

    private subscription: Subscription;

    constructor(
        private injector: Injector,
        private router: Router,
        @Inject(PLANET_APPLICATIONS) @Optional() planetApplications: PlanetApplication[]
    ) {
        if (!this.planetApplicationLoader) {
            setApplicationLoader(this.injector.get(PlanetApplicationLoader));
        }
        if (!this.planetApplicationService) {
            setApplicationService(this.injector.get(PlanetApplicationService));
        }

        if (planetApplications) {
            this.registerApps(planetApplications);
        }
    }

    setOptions(options: Partial<PlanetOptions>) {
        this.planetApplicationLoader.setOptions(options);
        if (options.debugFactory) {
            setDebugFactory(options.debugFactory);
        }
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
        this.subscription = this.router.events
            .pipe(
                filter(event => {
                    return event instanceof NavigationEnd;
                }),
                map((event: NavigationEnd) => {
                    return event.urlAfterRedirects || event.url;
                }),
                startWith(location.pathname),
                distinctUntilChanged()
            )
            .subscribe((url: string) => {
                this.planetApplicationLoader.reroute({
                    url: url
                });
            });
    }

    stop() {
        this.subscription.unsubscribe();
    }
}
