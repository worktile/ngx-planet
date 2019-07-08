import { Injectable, ApplicationRef, NgModuleRef, NgZone, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ComponentType, DomPortalOutlet, ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { globalPlanet } from '../application/planet-application-ref';
import { PlanetComponentRef } from './planet-component-ref';
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
    private domPortalOutletCache = new WeakMap<any, DomPortalOutlet>();

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
        componentRef: PlanetComponentRef<TData>
    ): PortalInjector {
        const injectionTokens = new WeakMap<any, any>([[PlanetComponentRef, componentRef]]);
        const defaultInjector = appModuleRef.injector;
        return new PortalInjector(defaultInjector, injectionTokens);
    }

    private getContainerElement(config: PlantComponentConfig): HTMLElement {
        if (config.container) {
            if ((config.container as ElementRef).nativeElement) {
                return (config.container as ElementRef).nativeElement;
            } else {
                return config.container as HTMLElement;
            }
        } else {
            throw new Error(`config 'container' cannot be null`);
        }
    }

    private attachComponent<TData>(
        plantComponent: PlanetComponent,
        appModuleRef: NgModuleRef<any>,
        config: PlantComponentConfig
    ): PlanetComponentRef<TData> {
        const plantComponentRef = new PlanetComponentRef();
        const componentFactoryResolver = appModuleRef.componentFactoryResolver;
        const appRef = this.applicationRef;
        const injector = this.createInjector<TData>(appModuleRef, plantComponentRef);
        const container = this.getContainerElement(config);
        let portalOutlet = this.domPortalOutletCache.get(container);
        if (portalOutlet) {
            portalOutlet.detach();
        } else {
            portalOutlet = new DomPortalOutlet(container, componentFactoryResolver, appRef, injector);
            this.domPortalOutletCache.set(container, portalOutlet);
        }
        const componentPortal = new ComponentPortal(plantComponent.component, null);
        const componentRef = portalOutlet.attachComponentPortal<TData>(componentPortal);
        if (config.initialState) {
            Object.assign(componentRef.instance, config.initialState);
        }
        plantComponentRef.container = container;
        plantComponentRef.componentInstance = componentRef.instance;
        plantComponentRef.componentRef = componentRef;
        plantComponentRef.dispose = () => {
            this.domPortalOutletCache.delete(container);
            portalOutlet.dispose();
        };
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

    load<TData = any>(
        app: string,
        componentName: string,
        config: PlantComponentConfig<TData>,
        error: (error) => void = e => {}
    ) {
        const planetAppRef = this.getPlantAppRef(app);
        return planetAppRef.loadPlantComponent<TData>(componentName, config);
    }
}

function throwAppNotDefineError(app: string) {
    throw new Error(`${app} app is not define`);
}
