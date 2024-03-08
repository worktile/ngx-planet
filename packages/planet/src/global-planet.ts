import { PlanetApplicationRef } from './application/planet-application-ref';
import { PlanetPortalApplication } from './application/portal-application';
import { PlanetApplicationLoader } from './application/planet-application-loader';
import { PlanetApplicationService } from './application/planet-application.service';
import { isFunction } from './helpers';
import { NgBootstrapAppModule, NgBootstrapOptions, NgPlanetApplicationRef } from './application/ng-planet-application-ref';

declare const window: any;

export interface GlobalPlanet {
    apps: { [key: string]: PlanetApplicationRef };
    portalApplication?: PlanetPortalApplication;
    applicationLoader: PlanetApplicationLoader;
    applicationService: PlanetApplicationService;
}

export const globalPlanet: GlobalPlanet = (window.planet = window.planet || {
    apps: {}
});

export function defineApplication<TOptions extends NgBootstrapAppModule | NgBootstrapOptions>(name: string, options: TOptions) {
    if (globalPlanet.apps[name]) {
        throw new Error(`${name} application has exist.`);
    }
    if (isFunction(options)) {
        options = {
            template: '',
            bootstrap: options as NgBootstrapAppModule
        } as TOptions;
    }
    const appRef = new NgPlanetApplicationRef(name, options as NgBootstrapOptions);
    globalPlanet.apps[name] = appRef;
}

export function getPlanetApplicationRef(appName: string): PlanetApplicationRef | null {
    if (globalPlanet && globalPlanet.apps && globalPlanet.apps[appName]) {
        return globalPlanet.apps[appName];
    } else {
        return null;
    }
}

export function getBootstrappedPlanetApplicationRef(appName: string): PlanetApplicationRef | null {
    const plantAppRef = getPlanetApplicationRef(appName);
    if (plantAppRef) {
        // 兼容之前的版本，之前是通过 appModuleRef 来判断是否启用的
        if (plantAppRef.bootstrapped || plantAppRef['appModuleRef']) {
            return plantAppRef;
        }
    }
    return null;
}

export function setPortalApplicationData<T>(data: T) {
    if (globalPlanet.portalApplication) {
        globalPlanet.portalApplication.data = data;
    }
}

export function getPortalApplicationData<TData>(): TData {
    return globalPlanet.portalApplication?.data as TData;
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
