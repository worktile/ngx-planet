import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, RouterEvent, Router } from '@angular/router';
import { AssetsLoader } from './loader';
import { MicroHostApplication } from './host-application';
import { GlobalEventDispatcher } from './global-event-dispatcher';
import { getHTMLElement } from './helpers';

export interface ApplicationOptions {
    host: string | HTMLElement;
    selector: string;
    routerPathPrefix: string;
    stylePathPrefix?: string;
    styles?: string[];
    scriptPathPrefix?: string;
    scripts?: string[];
}

export interface ApplicationInfo {
    name: string;
    loaded?: boolean;
    options: ApplicationOptions;
}

@Injectable({
    providedIn: 'root'
})
export class MicroPortalService {
    private apps: ApplicationInfo[] = [];

    private appsMap: { [key: string]: ApplicationOptions } = {};

    private currentApp: ApplicationInfo;

    private hostApp = new MicroHostApplication();

    constructor(
        private assetsLoader: AssetsLoader,
        private ngZone: NgZone,
        private router: Router,
        private globalEventDispatcher: GlobalEventDispatcher
    ) {
        this.hostApp.ngZone = ngZone;
        this.hostApp.router = router;
        this.hostApp.globalEventDispatcher = globalEventDispatcher;
    }

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
        if (app.loaded) {
            return Promise.resolve([]);
        }
        let scripts = app.options.scripts;
        if (app.options.scriptPathPrefix) {
            scripts = scripts.map(script => {
                return `${app.options.scriptPathPrefix}/${script}`;
            });
        }
        return this.assetsLoader.loadScripts(scripts);
    }

    bootstrapApp(app: ApplicationInfo) {
        this.ngZone.runOutsideAngular(() => {
            this.loadApp(app).then(result => {
                app.loaded = true;
                const appInstance = (window as any)[app.name];
                this.currentApp = app;
                if (appInstance && appInstance.app && appInstance.app.bootstrap) {
                    const container = getHTMLElement(app.options.host);
                    if (container) {
                        let appRootElement = container.querySelector(app.options.selector);
                        if (!appRootElement) {
                            appRootElement = window.document.createElement(app.options.selector);
                            appRootElement.setAttribute('class', 'thy-layout');
                            container.appendChild(appRootElement);
                        }
                    }
                    appInstance.app.bootstrap(this.hostApp);
                }
            });
        });
    }

    destroyApplication(app: ApplicationInfo) {
        const appInstance = (window as any)[app.name];
        if (appInstance) {
            appInstance.app.destroy();
        }
        const container = getHTMLElement(app.options.host);
        const appRootElement = container.querySelector(app.options.selector);
        if (appRootElement) {
            container.removeChild(appRootElement);
        }
    }

    destroyCurrentApplication() {
        if (this.currentApp) {
            this.destroyApplication(this.currentApp);
        }
    }

    resetRouting(event: RouterEvent) {
        if (this.currentApp) {
            this.destroyApplication(this.currentApp);
        }
        this.apps.forEach(app => {
            if (event.url.includes(app.options.routerPathPrefix)) {
                this.bootstrapApp(app);
            }
        });
    }
}
