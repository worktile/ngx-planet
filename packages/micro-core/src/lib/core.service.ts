import { Injectable } from '@angular/core';

export interface ApplicationOptions {
    routerPathPrefix: string;
    stylePathPrefix: string;
    styles: string[];
    scriptPathPrefix: string;
    scripts: string[];
}

@Injectable({
    providedIn: 'root'
})
export class MicroCoreService {
    private appsMap: { [key: string]: ApplicationOptions } = {};

    constructor() {}

    registerApplication(appName: string, options: ApplicationOptions) {
        if (this.appsMap[appName]) {
            throw new Error(`${appName} has be registered.`);
        }
        this.appsMap[appName] = options;
    }
}
