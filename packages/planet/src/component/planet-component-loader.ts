import { DOCUMENT } from '@angular/common';
import {
    ApplicationRef,
    ComponentRef,
    ElementRef,
    EmbeddedViewRef,
    EnvironmentInjector,
    Inject,
    Injectable,
    Injector,
    NgModuleRef,
    NgZone,
    TemplateRef,
    Type,
    createComponent,
    reflectComponentType
} from '@angular/core';
import { PlanetPortalApplication } from 'ngx-planet';
import { Observable, of, timer } from 'rxjs';
import { delayWhen, map, shareReplay } from 'rxjs/operators';
import { NgPlanetApplicationRef } from '../application/ng-planet-application-ref';
import { PlanetApplicationRef } from '../application/planet-application-ref';
import {
    getApplicationLoader,
    getApplicationService,
    getBootstrappedPlanetApplicationRef,
    getPlanetApplicationRef,
    globalPlanet
} from '../global-planet';
import { coerceArray } from '../helpers';
import { PlanetComponentRef } from './planet-component-types';
import { PlantComponentConfig } from './plant-component.config';

const componentWrapperClass = 'planet-component-wrapper';

function isComponentType<T>(component: PlanetComponent<T>): component is Type<T> {
    return typeof component === 'function' && component.constructor === Function;
}

export type PlanetComponent<T = unknown> =
    | {
          name: string;
          component: Type<T>;
      }
    | Type<T>;

@Injectable({
    providedIn: 'root'
})
export class PlanetComponentLoader {
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
        const plantAppRef = getBootstrappedPlanetApplicationRef(name);
        if (plantAppRef) {
            return of(plantAppRef);
        } else {
            const app = this.applicationService.getAppByName(name);
            return this.applicationLoader.preload(app, true).pipe(
                map(() => {
                    return getPlanetApplicationRef(name);
                })
            );
        }
    }

    private createInjector<TData>(parentInjector: Injector, componentRef: PlanetComponentRef<TData>): Injector {
        return Injector.create({
            providers: [
                {
                    provide: PlanetComponentRef,
                    useValue: componentRef
                }
            ],
            parent: parentInjector
        });
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

    private insertComponentRootNodeToContainer(container: HTMLElement, componentRootNode: HTMLElement, hostClass: string) {
        const subApp = this.applicationService.getAppByName(this.ngModuleRef.instance.appName);
        componentRootNode.classList.add(componentWrapperClass);
        componentRootNode.setAttribute('planet-inline', '');
        if (hostClass) {
            componentRootNode.classList.add(hostClass);
        }
        if (subApp && subApp.stylePrefix) {
            componentRootNode.classList.add(subApp.stylePrefix);
        }
        // container 是注释则在前方插入，否则在元素内部插入
        if (container.nodeType === 8) {
            container.parentElement.insertBefore(componentRootNode, container);
        } else {
            container.appendChild(componentRootNode);
        }
    }

    private attachComponent<TData>(
        component: Type<unknown>,
        environmentInjector: EnvironmentInjector,
        config: PlantComponentConfig
    ): PlanetComponentRef<TData> {
        const plantComponentRef = new PlanetComponentRef();
        const appRef = this.applicationRef;
        const injector = this.createInjector<TData>(environmentInjector, plantComponentRef);
        const container = this.getContainerElement(config);

        const componentRef = createComponent(component, {
            environmentInjector: environmentInjector,
            elementInjector: injector,
            projectableNodes: config.projectableNodes as Node[][]
        });
        appRef.attachView(componentRef.hostView);
        const componentRootNode = this.getComponentRootNode(componentRef);
        this.insertComponentRootNodeToContainer(container, componentRootNode, config.hostClass || config.wrapperClass);
        if (config.initialState) {
            Object.assign(componentRef.instance, config.initialState);
        }
        plantComponentRef.componentInstance = componentRef.instance;
        plantComponentRef.componentRef = componentRef;
        plantComponentRef.hostElement = componentRootNode;
        plantComponentRef.dispose = () => {
            if (appRef.viewCount > 0) {
                appRef.detachView(componentRef.hostView);
            }
            componentRef?.destroy();
            componentRootNode.remove();
        };
        return plantComponentRef;
    }

    /** Gets the root HTMLElement for an instantiated component. */
    private getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }

    private registerComponentFactory(componentOrComponents: PlanetComponent | PlanetComponent[]) {
        const app = this.ngModuleRef.instance.appName;
        let appRef$: Observable<NgPlanetApplicationRef | PlanetPortalApplication>;

        if (app) {
            appRef$ = this.getPlantAppRef(app) as Observable<NgPlanetApplicationRef>;
        } else {
            appRef$ = of(globalPlanet.portalApplication);
        }

        appRef$.subscribe(appRef => {
            appRef.registerComponentFactory((componentName: string, config: PlantComponentConfig<any>) => {
                const components = coerceArray(componentOrComponents);
                const planetComponent = components.find(item => {
                    return isComponentType(item)
                        ? reflectComponentType(item).selector.includes(componentName)
                        : item.name === componentName;
                });
                if (planetComponent) {
                    return this.ngZone.run(() => {
                        const componentRef = this.attachComponent<any>(
                            isComponentType(planetComponent) ? planetComponent : planetComponent.component,
                            appRef instanceof NgPlanetApplicationRef ? appRef.appModuleRef.injector : this.ngModuleRef.injector,
                            config
                        );
                        return componentRef;
                    });
                } else {
                    throw Error(`unregistered component ${componentName} in app ${app}`);
                }
            });
        });
    }

    register(components: PlanetComponent | PlanetComponent[], immediate?: boolean) {
        if (immediate) {
            this.registerComponentFactory(components);
        } else {
            setTimeout(() => {
                this.registerComponentFactory(components);
            });
        }
    }

    load<TComp = unknown, TData = unknown>(
        app: string,
        componentName: string,
        config: PlantComponentConfig<TData>
    ): Observable<PlanetComponentRef<TComp>> {
        let appRef$: Observable<NgPlanetApplicationRef | PlanetPortalApplication>;
        if (app === globalPlanet.portalApplication.name) {
            appRef$ = of(globalPlanet.portalApplication);
        } else {
            appRef$ = this.getPlantAppRef(app).pipe(
                delayWhen((appRef: NgPlanetApplicationRef) => {
                    if (appRef.getComponentFactory()) {
                        return of('');
                    } else {
                        // Because register use 'setTimeout',so timer 20
                        return timer(20);
                    }
                })
            );
        }
        const result = appRef$.pipe(
            map(appRef => {
                const componentFactory = appRef.getComponentFactory();
                if (componentFactory) {
                    const projectableEmbeddedViewRefs: EmbeddedViewRef<any>[] = [];
                    const projectableNodes: Node[][] = (config.projectableNodes || []).map(node => {
                        if (node instanceof TemplateRef) {
                            const viewRef = node.createEmbeddedView({});
                            projectableEmbeddedViewRefs.push(viewRef);
                            this.applicationRef.attachView(viewRef);
                            return viewRef.rootNodes;
                        } else {
                            return node;
                        }
                    });
                    const compRef = componentFactory<TData, TComp>(componentName, { ...config, projectableNodes: projectableNodes });
                    const dispose = compRef.dispose.bind(compRef);
                    compRef.dispose = () => {
                        projectableEmbeddedViewRefs.forEach(viewRef => {
                            this.applicationRef.detachView(viewRef);
                            viewRef.destroy();
                        });
                        dispose();
                    };
                    return compRef;
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
