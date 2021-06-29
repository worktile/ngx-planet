import { Injectable, ApplicationRef, NgModuleRef, NgZone, ElementRef, Inject } from '@angular/core';
import { ComponentType, DomPortalOutlet, ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { PlanetApplicationRef } from '../application/planet-application-ref';
import { PlanetComponentRef } from './planet-component-ref';
import { PlantComponentConfig } from './plant-component.config';
import { coerceArray } from '../helpers';
import { map, shareReplay, finalize, debounce, filter, take, delay, delayWhen } from 'rxjs/operators';
import { of, Observable, interval, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { globalPlanet, getApplicationLoader, getApplicationService } from '../global-planet';

const componentWrapperClass = 'planet-component-wrapper';

export interface PlanetComponent<T = any> {
    name: string;
    component: ComponentType<T>;
}

@Injectable({
    providedIn: 'root'
})
export class PlanetComponentLoader {
    private domPortalOutletCache = new WeakMap<any, DomPortalOutlet>();

    private get applicationLoader() {
        return getApplicationLoader();
    }

    private get applicationService() {
        return getApplicationService();
    }

    constructor(
        private applicationRef: ApplicationRef,
        private ngModuleRef: NgModuleRef<any>,
        private ngZone: NgZone,
        @Inject(DOCUMENT) private document: any
    ) {}

    private getPlantAppRef(name: string): Observable<PlanetApplicationRef> {
        if (globalPlanet.apps[name] && globalPlanet.apps[name].appModuleRef) {
            return of(globalPlanet.apps[name]);
        } else {
            const app = this.applicationService.getAppByName(name);
            return this.applicationLoader.preload(app, true).pipe(
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

    private createWrapperElement(config: PlantComponentConfig) {
        const container = this.getContainerElement(config);
        const element = this.document.createElement('div');
        const subApp = this.applicationService.getAppByName(this.ngModuleRef.instance.appName);
        element.classList.add(componentWrapperClass);
        element.setAttribute('planet-inline', '');
        if (config.wrapperClass) {
            element.classList.add(config.wrapperClass);
        }
        if (subApp && subApp.stylePrefix) {
            element.classList.add(subApp.stylePrefix);
        }
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
        const wrapper = this.createWrapperElement(config);
        let portalOutlet = this.domPortalOutletCache.get(wrapper);
        if (portalOutlet) {
            portalOutlet.detach();
        } else {
            portalOutlet = new DomPortalOutlet(wrapper, componentFactoryResolver, appRef, injector);
            this.domPortalOutletCache.set(wrapper, portalOutlet);
        }
        const componentPortal = new ComponentPortal(plantComponent.component, null);
        const componentRef = portalOutlet.attachComponentPortal<TData>(componentPortal);
        if (config.initialState) {
            Object.assign(componentRef.instance, config.initialState);
        }
        plantComponentRef.componentInstance = componentRef.instance;
        plantComponentRef.componentRef = componentRef;
        plantComponentRef.wrapperElement = wrapper;
        plantComponentRef.dispose = () => {
            this.domPortalOutletCache.delete(wrapper);
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
                        const componentRef = this.attachComponent<any>(component, appRef.appModuleRef, config);
                        return componentRef;
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

    load<TComp = unknown, TData = unknown>(
        app: string,
        componentName: string,
        config: PlantComponentConfig<TData>
    ): Observable<PlanetComponentRef<TComp>> {
        const result = this.getPlantAppRef(app).pipe(
            delayWhen(appRef => {
                if (appRef.getComponentFactory()) {
                    return of();
                } else {
                    // Because register use 'setTimeout',so timer 20
                    return timer(20);
                }
            }),
            map(appRef => {
                const componentFactory = appRef.getComponentFactory();
                if (componentFactory) {
                    return componentFactory<TData, TComp>(componentName, config);
                } else {
                    throw new Error(`${app}'s component(${componentName}) is not registered`);
                }
            }),
            shareReplay()
        );
        result.subscribe();
        return result;
    }
}
