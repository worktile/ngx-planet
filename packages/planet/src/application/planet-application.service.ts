import { PlanetApplication } from '../planet.class';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map, switchMap, startWith } from 'rxjs/operators';
import { coerceArray } from '../helpers';
import { Observable, of } from 'rxjs';
import { AssetsLoadResult, AssetsLoader } from '../assets-loader';
import { globalPlanet } from './planet-application-ref';

@Injectable({
    providedIn: 'root'
})
export class PlanetApplicationService {
    private apps: PlanetApplication[] = [];

    private appsMap: { [key: string]: PlanetApplication } = {};

    constructor(private http: HttpClient, private assetsLoader: AssetsLoader) {}

    register<TExtra>(appOrApps: PlanetApplication<TExtra> | PlanetApplication<TExtra>[]) {
        const apps = coerceArray(appOrApps);
        apps.forEach(app => {
            if (this.appsMap[app.name]) {
                throw new Error(`${app.name} has be registered.`);
            }
            this.apps.push(app);
            this.appsMap[app.name] = app;
        });
        globalPlanet.registerApps = this.apps;
    }

    registerByUrl(url: string): Observable<void> {
        const result = this.http.get(`${url}`).pipe(
            map(apps => {
                if (apps && Array.isArray(apps)) {
                    this.register(apps);
                } else {
                    this.register(apps as PlanetApplication);
                }
            }),
            shareReplay()
        );
        result.subscribe();
        return result;
    }

    unregister(name: string) {
        if (this.appsMap[name]) {
            delete this.appsMap[name];
            this.apps = this.apps.filter(app => {
                return app.name !== name;
            });
            globalPlanet.registerApps = this.apps;
        }
    }

    getAppsByMatchedUrl<TExtra>(url: string): PlanetApplication<TExtra>[] {
        return this.getApps().filter(app => {
            if (app.routerPathPrefix instanceof RegExp) {
                return app.routerPathPrefix.test(url);
            } else {
                return url.startsWith(app.routerPathPrefix);
            }
        });
    }

    getAppByMatchedUrl<TExtra>(url: string): PlanetApplication<TExtra> {
        return this.getApps().find(app => {
            if (app.routerPathPrefix instanceof RegExp) {
                return app.routerPathPrefix.test(url);
            } else {
                return url.startsWith(app.routerPathPrefix);
            }
        });
    }

    getAppsToPreload(excludeAppNames?: string[]) {
        return this.getApps().filter(app => {
            if (excludeAppNames) {
                return app.preload && !excludeAppNames.includes(app.name);
            } else {
                return app.preload;
            }
        });
    }

    getApps() {
        return this.apps;
    }
}

export function getPlanetApplicationByName(name: string) {
    return globalPlanet.registerApps.find(app => {
        return app.name === name;
    });
}
