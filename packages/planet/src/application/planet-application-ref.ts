import { NgModuleRef, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { take } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { PlanetPortalApplication } from './portal-application';
import { PlantComponentConfig } from '../component/plant-component.config';
import { PlanetComponentRef } from '../component/planet-component-ref';
import { getTagNameByTemplate } from '../helpers';
import { getSandboxInstance, Sandbox } from '../sandbox/';

export interface BootstrapOptions {
    template: string;
    bootstrap: BootstrapAppModule;
}

export type BootstrapAppModule = (portalApp?: PlanetPortalApplication) => Promise<NgModuleRef<any>>;

export type PlantComponentFactory = <TData, TComp>(
    componentName: string,
    config: PlantComponentConfig<TData>
) => PlanetComponentRef<TComp>;

export class PlanetApplicationRef {
    public appModuleRef: NgModuleRef<any>;
    public template: string;
    private innerSelector: string;
    private name: string;
    private portalApp: PlanetPortalApplication;
    private appModuleBootstrap: (app: PlanetPortalApplication) => Promise<NgModuleRef<any>>;
    private componentFactory: PlantComponentFactory;

    public get selector() {
        return this.innerSelector;
    }

    public get bootstrapped() {
        return !!this.appModuleRef;
    }

    public get ngZone(): NgZone {
        return this.appModuleRef.injector.get(NgZone);
    }

    public get sandbox(): Sandbox {
        return getSandboxInstance();
    }

    constructor(name: string, options: BootstrapOptions) {
        this.name = name;
        if (options) {
            this.template = options.template;
            this.innerSelector = this.template ? getTagNameByTemplate(this.template) : null;
            this.appModuleBootstrap = options.bootstrap;
        }
        // This is a hack, since NgZone doesn't allow you to configure the property that identifies your zone.
        // See https://github.com/PlaceMe-SAS/single-spa-angular-cli/issues/33,
        NgZone.isInAngularZone = () => {
            // @ts-ignore
            return window.Zone.current._properties[`ngx-planet-${name}`] === true;
        };
    }

    // 子应用路由变化后同步修改 portal 的 Route
    private syncPortalRouteWhenNavigationEnd() {
        const router = this.appModuleRef.injector.get(Router);
        if (router) {
            router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    this.ngZone.onStable
                        .asObservable()
                        .pipe(take(1))
                        .subscribe(() => {
                            this.portalApp.router.navigateByUrl(event.url);
                        });
                }
            });
        }
    }

    bootstrap(app: PlanetPortalApplication): Observable<this> {
        if (!this.appModuleBootstrap) {
            throw new Error(`app(${this.name}) is not defined`);
        }
        this.portalApp = app;
        return from(
            this.appModuleBootstrap(app).then(appModuleRef => {
                this.appModuleRef = appModuleRef;
                this.appModuleRef.instance.appName = this.name;
                this.syncPortalRouteWhenNavigationEnd();
                return this;
            })
        );
    }

    getRouter() {
        return this.appModuleRef.injector.get(Router);
    }

    getCurrentRouterStateUrl() {
        return this.getRouter().routerState.snapshot.url;
    }

    navigateByUrl(url: string): void {
        const router = this.getRouter();
        this.ngZone.run(() => {
            router.navigateByUrl(url);
        });
    }

    getComponentFactory() {
        return this.componentFactory;
    }

    registerComponentFactory(componentFactory: PlantComponentFactory) {
        this.componentFactory = componentFactory;
    }

    destroy(): void {
        if (this.appModuleRef) {
            const router = this.appModuleRef.injector.get(Router);
            if (router) {
                router.dispose();
            }
            if (this.sandbox) {
                this.sandbox.destroy();
            }
            this.appModuleRef.destroy();
            delete this.appModuleRef;
        }
    }
}
