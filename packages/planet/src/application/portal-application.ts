import { Router, UrlTree, NavigationExtras } from '@angular/router';
import { NgZone } from '@angular/core';
import { GlobalEventDispatcher } from '../global-event-dispatcher';

export class PlanetPortalApplication {
    router: Router;
    ngZone: NgZone;
    globalEventDispatcher: GlobalEventDispatcher;
    navigateByUrl(url: string | UrlTree, extras?: NavigationExtras): Promise<boolean> {
        return this.ngZone.run(() => {
            return this.router.navigateByUrl(url, extras);
        });
    }
}
