import { Component, inject } from '@angular/core';
import { ActivatedRoute, Route, Router, UrlTree } from '@angular/router';

class RouteRedirect {
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);

    constructor(redirectTo: string) {
        const finalRedirectTo = redirectTo || this.activatedRoute.snapshot.data['redirectTo'];
        if (finalRedirectTo) {
            const activatedRouteUrl = this.activatedRoute.pathFromRoot
                .filter(route => {
                    return route.snapshot.url?.length > 0;
                })
                .map(route => {
                    return route.snapshot.url.join('/');
                })
                .join('/');
            if (
                this.router.isActive(activatedRouteUrl, {
                    matrixParams: 'exact',
                    paths: 'exact',
                    queryParams: 'exact',
                    fragment: 'exact'
                })
            ) {
                this.router.navigate(
                    [`${finalRedirectTo}`],
                    // By replacing the current URL in the history, we keep the Browser's Back
                    // Button behavior in tact. This will allow the user to easily navigate back
                    // to the previous URL without getting caught in a redirect.
                    {
                        replaceUrl: true,
                        relativeTo: this.activatedRoute
                    }
                );
            }
        }
    }
}

export function routeRedirect(redirectTo?: string) {
    return new RouteRedirect(redirectTo);
}

@Component({
    selector: 'planet-redirect-to-route',
    template: '',
    standalone: true
})
export class RedirectToRouteComponent {
    routeRedirect = routeRedirect();
}

export function redirectToRoute(redirectTo: string): Route {
    return {
        path: '',
        component: RedirectToRouteComponent,
        data: {
            redirectTo: redirectTo
        }
    };
}
