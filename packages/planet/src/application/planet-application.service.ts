import { PlanetApplication } from '../planet.class';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map } from 'rxjs/operators';
import { coerceArray } from '../helpers';

interface InternalPlanetApplication extends PlanetApplication {
    loaded?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PlanetApplicationService {
    private apps: InternalPlanetApplication[] = [];

    private appsMap: { [key: string]: InternalPlanetApplication } = {};

    private currentApps: InternalPlanetApplication[] = [];

    constructor(private http: HttpClient) {}

    register(appOrApps: PlanetApplication | PlanetApplication[]) {
        const apps = coerceArray(appOrApps);
        apps.forEach(app => {
            if (this.appsMap[app.name]) {
                throw new Error(`${app.name} has be registered.`);
            }
            this.apps.push(app);
            this.appsMap[app.name] = app;
        });
    }

    registerByUrl(url: string) {
        return this.http.get(`${url}?t=${new Date().getTime().toString()}`).pipe(
            map(apps => {
                if (apps && Array.isArray(apps)) {
                    apps.forEach(app => {
                        this.register(app);
                    });
                }
            })
        );
    }

    unregister(name: string) {
        if (this.appsMap[name]) {
            delete this.appsMap[name];
            this.apps = this.apps.filter(app => {
                return app.name !== name;
            });
        }
    }

    getAppsByMatchedUrl(url: string) {
        return this.apps.filter(app => {
            return url.includes(app.routerPathPrefix);
        });
    }

    getAppByMatchedUrl(url: string) {
        return this.apps.find(app => {
            return url.includes(app.routerPathPrefix);
        });
    }

    getAppsToPreload(excludeAppNames?: string[]) {
        return this.apps.filter(app => {
            if (excludeAppNames) {
                return app.preload && !excludeAppNames.includes(app.name);
            } else {
                return app.preload;
            }
        });
    }
}
