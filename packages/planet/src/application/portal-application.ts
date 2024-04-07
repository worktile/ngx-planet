import { ApplicationRef, Injector, NgZone } from '@angular/core';
import { NavigationExtras, Router, UrlTree } from '@angular/router';
import { PlantComponentFactory } from '../component/planet-component-ref';
import { GlobalEventDispatcher } from '../global-event-dispatcher';

export class PlanetPortalApplication<TData = any> {
    applicationRef?: ApplicationRef;
    injector?: Injector;
    router?: Router;
    ngZone?: NgZone;
    globalEventDispatcher?: GlobalEventDispatcher;
    data?: TData;
    name?: string;
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
