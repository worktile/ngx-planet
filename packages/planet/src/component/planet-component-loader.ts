import { Injectable, ApplicationRef, NgModuleRef, NgZone, ElementRef, Inject } from '@angular/core';
import { ComponentType, DomPortalOutlet, ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { globalPlanet, PlanetApplicationRef } from '../application/planet-application-ref';
import { PlanetComponentRef } from './planet-component-ref';
import { PlantComponentConfig } from './plant-component.config';
import { coerceArray } from '../helpers';
import { getPlanetApplicationByName } from '../application/planet-application.service';
import { PlanetApplicationLoader } from '../application/planet-application-loader';
import { delay, map, shareReplay, finalize } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

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
        private ngZone: NgZone,
        private applicationLoader: PlanetApplicationLoader,
        @Inject(DOCUMENT) private document: any
    ) {}

    private getPlantAppRef(name: string): Observable<PlanetApplicationRef> {
        if (globalPlanet.apps[name] && globalPlanet.apps[name].appModuleRef) {
            return of(globalPlanet.apps[name]);
        } else {
            const app = getPlanetApplicationByName(name);
            return this.applicationLoader.preload(app).pipe(
                // Because register use 'setTimeout',so delay 20
                delay(20),
                map(() => {
                    return globalPlanet.apps[name];
                })
            );
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
        if (!config.container) {
            throw new Error(`config 'container' cannot be null`);
        } else {
            if ((config.container as ElementRef).nativeElement) {
                return (config.container as ElementRef).nativeElement;
            } else {
                return config.container as HTMLElement;
            }
        }
    }

    private createContainerElement(config: PlantComponentConfig) {
        const container = this.getContainerElement(config);
        const element = this.document.createElement('div');
        element.classList.add('planet-component-container');
        container.appendChild(element);
        return element;
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
        const container = this.createContainerElement(config);
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
        this.getPlantAppRef(app).subscribe(appRef => {
            appRef.registerComponentFactory((componentName: string, config: PlantComponentConfig<any>) => {
                const components = coerceArray(componentOrComponents);
                const component = components.find(item => item.name === componentName);
                if (component) {
                    return this.ngZone.run(() => {
                        return this.attachComponent<any>(component, appRef.appModuleRef, config);
                    });
                } else {
                    throw Error(`unregistered component ${componentName} in app ${app}`);
                }
            });
        });
    }

    register(components: PlanetComponent | PlanetComponent[]) {
        setTimeout(() => {
            this.registerComponentFactory(components);
        });
    }

    load<TData = any>(app: string, componentName: string, config: PlantComponentConfig<TData>) {
        const result = this.getPlantAppRef(app).pipe(
            map(appRef => {
                const componentFactory = appRef.getComponentFactory();
                if (componentFactory) {
                    return componentFactory<TData>(componentName, config);
                } else {
                    throw new Error(`${app} not registered components`);
                }
            }),
            finalize(() => {
                this.applicationRef.tick();
            }),
            shareReplay()
        );
        result.subscribe();
        return result;
    }
}
