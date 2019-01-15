import { Injectable } from '@angular/core';
import { NavigationEnd, RouterEvent } from '@angular/router';
import { AssetsLoader } from './loader';

export interface ApplicationOptions {
    routerPathPrefix: string;
    stylePathPrefix?: string;
    styles?: string[];
    scriptPathPrefix?: string;
    scripts?: string[];
}

export interface ApplicationInfo {
    name: string;
    options: ApplicationOptions;
}

@Injectable({
    providedIn: 'root'
})
export class MicroCoreService {
    private apps: ApplicationInfo[] = [];

    private appsMap: { [key: string]: ApplicationOptions } = {};

    constructor(private assetsLoader: AssetsLoader) {}

    registerApplication(appName: string, options: ApplicationOptions) {
        if (this.appsMap[appName]) {
            throw new Error(`${appName} has be registered.`);
        }
        this.apps.push({
            name: appName,
            options: options
        });
        this.appsMap[appName] = options;
    }

    loadApp(app: ApplicationInfo) {
        let scripts = app.options.scripts;
        if (app.options.scriptPathPrefix) {
            scripts = scripts.map(script => {
                return `${app.options.scriptPathPrefix}/${script}`;
            });
        }
        return this.assetsLoader.loadScripts(scripts);
    }

    bootstrapApp(app: ApplicationInfo) {
        this.loadApp(app).then(result => {
            const appInstance = (window as any)[app.name];
            if (appInstance && appInstance.bootstrap) {
                appInstance.bootstrap();
            }
        });
    }

    resetRouting(event: RouterEvent) {
        this.apps.forEach(app => {
            if (event.url.includes(app.options.routerPathPrefix)) {
                this.bootstrapApp(app);
            }
        });
    }
}
