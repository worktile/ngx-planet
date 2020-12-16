import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InitializedDataResolver implements Resolve<unknown> {
    constructor() {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return of(null).pipe(delay(200));
    }
}
