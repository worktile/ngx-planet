import { Router, UrlTree, NavigationExtras } from '@angular/router';
import { NgZone, Injector, ApplicationRef } from '@angular/core';
import { PlantComponentFactory } from '../component/planet-component-types';
import { GlobalEventDispatcher } from '../global-event-dispatcher';

export class PlanetPortalApplication<TData = any> {
    applicationRef?: ApplicationRef;
    injector?: Injector;
    router?: Router;
    ngZone?: NgZone;
    globalEventDispatcher?: GlobalEventDispatcher;
    data?: TData;
    name?: string = 'portal';
    private componentFactory?: PlantComponentFactory;

    navigateByUrl(url: string | UrlTree, extras?: NavigationExtras): Promise<boolean> {
        return this.ngZone!.run(() => {
            return this.router!.navigateByUrl(url, extras);
        });
    }

    run<T>(fn: (...args: any[]) => T): T {
        return this.ngZone!.run<T>(() => {
            return fn();
        });
    }

    tick() {
        this.applicationRef!.tick();
    }

    getComponentFactory() {
        return this.componentFactory;
    }

    registerComponentFactory(componentFactory: PlantComponentFactory) {
        this.componentFactory = componentFactory;
    }
}
