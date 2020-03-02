import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { Compiler, Injector, Type, NgModuleRef } from '@angular/core';
import { app1Name, App1Module, App1ProjectsComponent } from './test/app1.module';
import { app2Name, App2Module } from './test/app2.module';
import { defineApplication, getPlanetApplicationRef } from '../application/planet-application-ref';
import { PlanetPortalApplication } from '../application/portal-application';
import { PlanetComponentLoader } from './planet-component-loader';
import { PlanetApplicationLoader } from '../application/planet-application-loader';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PlantComponentConfig } from './plant-component.config';

describe('PlanetComponentLoader', () => {
    let compiler: Compiler;
    let injector: Injector;

    function defineAndBootstrapApplication(name: string, appModule: Type<any>) {
        const ngModuleFactory = compiler.compileModuleSync(appModule);
        const ngModuleRef = ngModuleFactory.create(injector);
        defineApplication(name, (portalApp?: PlanetPortalApplication) => {
            return new Promise(resolve => {
                resolve(ngModuleRef);
            });
        });
        const appRef = getPlanetApplicationRef(name);
        const portalApplication = new PlanetPortalApplication();
        appRef.bootstrap(portalApplication);
        return ngModuleRef;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterModule.forRoot([])]
        });
    });

    afterEach(() => {
        (window as any).planet.apps = {};
    });

    beforeEach(inject([Compiler, Injector], (_compiler: Compiler, _injector: Injector) => {
        compiler = _compiler;
        injector = _injector;
    }));

    it('should register component success', fakeAsync(() => {
        // mock app1 and app2 bootstrap
        const app1ModuleRef = defineAndBootstrapApplication(app1Name, App1Module);
        registerAppComponents(app1ModuleRef);
        const app1Ref = getPlanetApplicationRef(app1Name);
        expect(app1Ref.getComponentFactory()).toBeTruthy();
    }));

    it('should app2 load app1 component', fakeAsync(() => {
        // mock app1 and app2 bootstrap
        const app1ModuleRef = defineAndBootstrapApplication(app1Name, App1Module);
        const app2ModuleRef = defineAndBootstrapApplication(app2Name, App2Module);
        tick();

        expect(() => {
            loadApp1Component(app2ModuleRef);
        }).toThrowError(`${app1Name} not registered components`);

        registerAppComponents(app1ModuleRef);

        expect(() => {
            loadApp1Component(app2ModuleRef, { container: null });
        }).toThrowError(`config 'container' cannot be null`);

        loadApp1ComponentAndExpectHtml(app2ModuleRef);
    }));

    it('should app2 load app1 component and preload app1', fakeAsync(() => {
        // mock app2 bootstrap
        const app2ModuleRef = defineAndBootstrapApplication(app2Name, App1Module);
        // mock app1 preload
        const applicationLoader = app2ModuleRef.injector.get(PlanetApplicationLoader);
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

    it('should app2 dispose app1 component ', fakeAsync(() => {
        // mock app1 and app2 bootstrap
        const app1ModuleRef = defineAndBootstrapApplication(app1Name, App1Module);
        const app2ModuleRef = defineAndBootstrapApplication(app2Name, App2Module);
        registerAppComponents(app1ModuleRef);
        loadApp1Component(app2ModuleRef).subscribe(componentRef => {
            const parent = componentRef.container.parentElement;
            componentRef.dispose();
            expect(parent.innerHTML).toEqual('');
        });
    }));
});

function registerAppComponents(appModuleRef: NgModuleRef<any>) {
    const componentLoader = appModuleRef.injector.get(PlanetComponentLoader);
    componentLoader.register([{ name: 'app1-projects', component: App1ProjectsComponent }]);
    tick();
}

function loadApp1Component(appModuleRef: NgModuleRef<any>, config?: PlantComponentConfig) {
    const componentLoader = appModuleRef.injector.get(PlanetComponentLoader);
    const hostElement = createComponentHostElement();
    const result = componentLoader.load(app1Name, 'app1-projects', config ? config : { container: hostElement });
    tick(30);
    return result;
}

function loadApp1ComponentAndExpectHtml(app2ModuleRef: NgModuleRef<any>) {
    loadApp1Component(app2ModuleRef).subscribe(componentRef => {
        expect(componentRef.container.outerHTML).toEqual(
            `<div class="planet-component-container"><app1-projects> projects is work </app1-projects></div>`
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
