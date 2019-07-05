import { Injectable, ApplicationRef, NgModuleRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { ComponentType, DomPortalOutlet, ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { globalPlanet } from '../application/planet-application-ref';
import { PlantComponentRef } from './planet-component-ref';
import { PlantComponentConfig } from './plant-component.config';
import { coerceArray } from '../helpers';

export interface PlanetComponent<T = any> {
    name: string;
    component: ComponentType<T>;
}

@Injectable({
    providedIn: 'root'
})
export class PlanetComponentLoader {
    public domPortalOutletCache = new WeakMap<HTMLElement, DomPortalOutlet>();

    constructor(
        private applicationRef: ApplicationRef,
        private ngModuleRef: NgModuleRef<any>,
        private ngZone: NgZone
    ) {}

    private getPlantAppRef(app: string) {
        if (globalPlanet.apps[app]) {
            return globalPlanet.apps[app];
        } else {
            throwAppNotDefineError(app);
        }
    }

    private createInjector<TData>(
        appModuleRef: NgModuleRef<any>,
        componentRef: PlantComponentRef<TData>
    ): PortalInjector {
        const injectionTokens = new WeakMap<any, any>([[PlantComponentRef, componentRef]]);
        const defaultInjector = appModuleRef.injector;
        return new PortalInjector(defaultInjector, injectionTokens);
    }

    private attachComponent<TData>(
        plantComponent: PlanetComponent,
        appModuleRef: NgModuleRef<any>,
        config: PlantComponentConfig
    ): PlantComponentRef<TData> {
        const plantComponentRef = new PlantComponentRef();
        const componentFactoryResolver = appModuleRef.componentFactoryResolver;
        const appRef = this.applicationRef;
        const injector = this.createInjector<TData>(appModuleRef, plantComponentRef);
        let portalOutlet = this.domPortalOutletCache.get(config.container);
        if (portalOutlet) {
            portalOutlet.detach();
        } else {
            portalOutlet = new DomPortalOutlet(config.container, componentFactoryResolver, appRef, injector);
            this.domPortalOutletCache.set(config.container, portalOutlet);
        }
        const componentPortal = new ComponentPortal(plantComponent.component, config.viewContainerRef);
        const componentRef = portalOutlet.attachComponentPortal<TData>(componentPortal);
        if (config.initialState) {
            Object.assign(componentRef.instance, config.initialState);
        }
        plantComponentRef.container = config.container;
        plantComponentRef.componentInstance = componentRef.instance;
        plantComponentRef.componentRef = componentRef;
        return plantComponentRef;
    }

    private registerComponentFactory(componentOrComponents: PlanetComponent | PlanetComponent[]) {
        const app = this.ngModuleRef.instance.appName;
        const planetAppRef = this.getPlantAppRef(app);
        planetAppRef.registerComponentFactory((componentName: string, config: PlantComponentConfig<any>) => {
            const components = coerceArray(componentOrComponents);
            const component = components.find(item => item.name === componentName);
            if (component) {
                return this.ngZone.run(() => {
                    return this.attachComponent<any>(component, planetAppRef.appModuleRef, config);
                });
            } else {
                throw Error(`unregistered component ${componentName} in app ${app}`);
            }
        });
    }

    register(components: PlanetComponent | PlanetComponent[]) {
        setTimeout(() => {
            this.registerComponentFactory(components);
        });
    }

    load<TData = any>(app: string, componentName: string, config: PlantComponentConfig<TData>) {
        const planetAppRef = globalPlanet.apps[app];
        return planetAppRef.loadPlantComponent<TData>(componentName, config);
    }
}

function throwAppNotDefineError(app: string) {
    throw new Error(`${app} app is not define`);
}
