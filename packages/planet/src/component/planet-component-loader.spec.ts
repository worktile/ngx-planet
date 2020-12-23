import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { Compiler, Injector, Type, NgModuleRef } from '@angular/core';
import { app1Name, App1Module, App1ProjectsComponent } from '../testing/app1.module';
import { app2Name, App2Module } from '../testing/app2.module';
import { PlanetPortalApplication } from '../application/portal-application';
import { PlanetComponentLoader } from './planet-component-loader';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PlantComponentConfig } from './plant-component.config';
import {
    defineApplication,
    getPlanetApplicationRef,
    getApplicationLoader,
    clearGlobalPlanet,
    getApplicationService
} from '../global-planet';
import { Planet } from 'ngx-planet/planet';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlanetComponentLoader', () => {
    let compiler: Compiler;
    let injector: Injector;
    let planet: Planet;

    function defineAndBootstrapApplication(name: string, appModule: Type<any>) {
        const ngModuleFactory = compiler.compileModuleSync(appModule);
        const ngModuleRef = ngModuleFactory.create(injector);
        defineApplication(name, {
            template: '<app1-root></app1-root>',
            bootstrap: (portalApp?: PlanetPortalApplication) => {
                return new Promise(resolve => {
                    resolve(ngModuleRef);
                });
            }
        });
        const appRef = getPlanetApplicationRef(name);
        const portalApplication = new PlanetPortalApplication();
        appRef.bootstrap(portalApplication);
        return ngModuleRef;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])]
        });
        compiler = TestBed.inject(Compiler);
        planet = TestBed.inject(Planet);
        injector = TestBed.inject(Injector);
    });

    afterEach(() => {
        clearGlobalPlanet();
    });

    it('should register component success', fakeAsync(() => {
        // mock app1 and app2 bootstrap
        const app1ModuleRef = defineAndBootstrapApplication(app1Name, App1Module);
        registerAppComponents(app1ModuleRef);
        tick();
        const app1Ref = getPlanetApplicationRef(app1Name);
        expect(app1Ref.getComponentFactory()).toBeTruthy();
    }));

    it('should app2 load app1 component when app1 component has completed the registration', fakeAsync(() => {
        // mock app1 and app2 bootstrap
        const app1ModuleRef = defineAndBootstrapApplication(app1Name, App1Module);
        const app2ModuleRef = defineAndBootstrapApplication(app2Name, App2Module);
        tick();

        expect(() => {
            loadApp1Component(app2ModuleRef);
        }).toThrowError(`${app1Name}'s component(app1-projects) is not registered`);

        registerAppComponents(app1ModuleRef);
        tick();

        expect(() => {
            loadApp1Component(app2ModuleRef, { container: null });
        }).toThrowError(`config 'container' cannot be null`);

        loadApp1ComponentAndExpectHtml(app2ModuleRef);
    }));

    it('should app2 load app1 component with wrapperClass', fakeAsync(() => {
        // mock app1 and app2 bootstrap
        const app1ModuleRef = defineAndBootstrapApplication(app1Name, App1Module);
        const app2ModuleRef = defineAndBootstrapApplication(app2Name, App2Module);
        tick();
        registerAppComponents(app1ModuleRef);
        loadApp1Component(app2ModuleRef, { wrapperClass: 'custom-wrapper' }).subscribe(componentRef => {
            expect(componentRef.wrapperElement.classList.contains('planet-component-wrapper')).toBeTruthy();
            expect(componentRef.wrapperElement.classList.contains('custom-wrapper')).toBeTruthy();
        });
    }));

    it('should app2 load app1 component with stylePrefix of app1', fakeAsync(() => {
        // mock app1 and app2 bootstrap
        const app1ModuleRef = defineAndBootstrapApplication(app1Name, App1Module);
        const app2ModuleRef = defineAndBootstrapApplication(app2Name, App2Module);
        const applicationService = getApplicationService();
        const applicationServiceSpy = spyOn(applicationService, 'getAppByName');
        applicationServiceSpy.and.returnValue({
            stylePrefix: 'app1-prefix',
            name: 'app1',
            hostParent: '',
            routerPathPrefix: ''
        });
        tick();
        registerAppComponents(app1ModuleRef);
        loadApp1Component(app2ModuleRef, { wrapperClass: 'custom-wrapper' }).subscribe(componentRef => {
            expect(componentRef.wrapperElement.classList.contains('planet-component-wrapper')).toBeTruthy();
            expect(componentRef.wrapperElement.classList.contains('custom-wrapper')).toBeTruthy();
            expect(componentRef.wrapperElement.classList.contains('app1-prefix')).toBeTruthy();
        });
    }));

    it('should app2 load app1 component and preload app1', fakeAsync(() => {
        // mock app2 bootstrap
        const app2ModuleRef = defineAndBootstrapApplication(app2Name, App1Module);
        // mock app1 preload
        const applicationLoader = getApplicationLoader();
        const applicationLoaderSpy = spyOn(applicationLoader, 'preload');
        const preload$ = of(getPlanetApplicationRef(app1Name)).pipe(
            tap(() => {
                const app1ModuleRef = defineAndBootstrapApplication(app1Name, App1Module);
                registerAppComponents(app1ModuleRef);
            })
        );
        applicationLoaderSpy.and.returnValue(preload$);
        expect(applicationLoaderSpy).not.toHaveBeenCalled();
        loadApp1ComponentAndExpectHtml(app2ModuleRef);
        expect(applicationLoaderSpy).toHaveBeenCalled();
    }));

    it('should app2 dispose app1 component', fakeAsync(() => {
        // mock app1 and app2 bootstrap
        const app1ModuleRef = defineAndBootstrapApplication(app1Name, App1Module);
        const app2ModuleRef = defineAndBootstrapApplication(app2Name, App2Module);
        tick();
        registerAppComponents(app1ModuleRef);
        loadApp1Component(app2ModuleRef).subscribe(componentRef => {
            const parent = componentRef.wrapperElement.parentElement;
            componentRef.dispose();
            expect(parent.innerHTML).toEqual('');
        });
    }));
});

function registerAppComponents(appModuleRef: NgModuleRef<any>) {
    const componentLoader = appModuleRef.injector.get(PlanetComponentLoader);
    componentLoader.register([{ name: 'app1-projects', component: App1ProjectsComponent }]);
}

function loadApp1Component(appModuleRef: NgModuleRef<any>, config?: Partial<PlantComponentConfig>) {
    const componentLoader = appModuleRef.injector.get(PlanetComponentLoader);
    const hostElement = createComponentHostElement();
    const result = componentLoader.load(
        app1Name,
        'app1-projects',
        Object.assign({}, { container: hostElement }, config)
    );
    tick(20);
    return result;
}

function loadApp1ComponentAndExpectHtml(app2ModuleRef: NgModuleRef<any>) {
    loadApp1Component(app2ModuleRef).subscribe(componentRef => {
        expect(componentRef.wrapperElement.outerHTML).toEqual(
            `<div class="planet-component-wrapper" planet-inline=""><app1-projects> projects is work </app1-projects></div>`
        );
    });
}

function createComponentHostElement(): HTMLElement {
    const componentHostClass = 'component-host';
    let element = document.body.getElementsByClassName(componentHostClass)[0];
    if (element) {
        element.innerHTML = '';
        return element as HTMLElement;
    } else {
        element = document.createElement('DIV');
        element.classList.add('component-host');
        document.body.appendChild(element);
        return element as HTMLElement;
    }
}
