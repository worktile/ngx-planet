import { PlanetApplicationRef, BootstrapAppModule, BootstrapOptions } from './application/planet-application-ref';
import { PlanetPortalApplication } from './application/portal-application';
import { PlanetApplicationLoader } from './application/planet-application-loader';
import { PlanetApplicationService } from './application/planet-application.service';
import { isFunction } from './helpers';

declare const window: any;

export interface GlobalPlanet {
    apps: { [key: string]: PlanetApplicationRef };
    portalApplication?: PlanetPortalApplication;
    applicationLoader?: PlanetApplicationLoader;
    applicationService?: PlanetApplicationService;
}

export const globalPlanet: GlobalPlanet = (window.planet = window.planet || {
    apps: {}
});

export function defineApplication(name: string, options: BootstrapAppModule | BootstrapOptions) {
    if (globalPlanet.apps[name]) {
        throw new Error(`${name} application has exist.`);
    }
    if (isFunction(options)) {
        options = {
            template: '',
            bootstrap: options as BootstrapAppModule
        };
    }
    const appRef = new PlanetApplicationRef(name, options as BootstrapOptions);
    globalPlanet.apps[name] = appRef;
}

export function getPlanetApplicationRef(appName: string): PlanetApplicationRef {
    if (globalPlanet && globalPlanet.apps && globalPlanet.apps[appName]) {
        return globalPlanet.apps[appName];
    } else {
        return null;
    }
}

export function setPortalApplicationData<T>(data: T) {
    globalPlanet.portalApplication.data = data;
}

export function getPortalApplicationData<TData>(): TData {
    return globalPlanet.portalApplication.data as TData;
}

export function setApplicationLoader(loader: PlanetApplicationLoader) {
    globalPlanet.applicationLoader = loader;
}

export function getApplicationLoader() {
    return globalPlanet.applicationLoader;
}

export function setApplicationService(service: PlanetApplicationService) {
    globalPlanet.applicationService = service;
}

export function getApplicationService() {
    return globalPlanet.applicationService;
}

export function clearGlobalPlanet() {
    window.planet.apps = {};
    window.planet.portalApplication = null;
    window.planet.applicationLoader = null;
    window.planet.applicationService = null;
}
