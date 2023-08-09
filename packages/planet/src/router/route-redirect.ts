import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

class RouteRedirect {
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);

    constructor(redirectTo: string) {
        const finalRedirectTo = redirectTo || this.activatedRoute.snapshot.data.redirectTo;
        if (finalRedirectTo) {
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

export function routeRedirect(redirectTo?: string) {
    return new RouteRedirect(redirectTo);
}
