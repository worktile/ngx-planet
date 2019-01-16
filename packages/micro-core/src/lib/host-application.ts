import { Router, UrlTree, NavigationExtras } from '@angular/router';
import { GlobalEventDispatcher } from './global-event-dispatcher';
import { NgZone } from '@angular/core';

export class MicroHostApplication {
    router: Router;
    ngZone: NgZone;
    globalEventDispatcher: GlobalEventDispatcher;
    navigateByUrl(url: string | UrlTree, extras?: NavigationExtras): Promise<boolean> {
        return this.ngZone.run(() => {
            return this.router.navigateByUrl(url, extras);
        });
    }
}
