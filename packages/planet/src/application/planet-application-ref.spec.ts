import { PlanetPortalApplication } from './portal-application';
import { NgModule, Compiler, Injector, Component, NgZone } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { defineApplication, getPlanetApplicationRef, clearGlobalPlanet } from '../global-planet';

@Component({
    selector: 'app-root',
    template: `
        <router-outlet></router-outlet>
    `
})
class EmptyComponent {}
@NgModule({
    declarations: [EmptyComponent],
    imports: [
        RouterModule.forRoot([
            {
                path: 'app1',
                component: EmptyComponent
            }
        ])
    ]
})
class AppModule {}

describe('PlanetApplicationRef', () => {
    afterEach(() => {
        clearGlobalPlanet();
    });

    describe('getPlanetApplicationRef', () => {
        it('should get planet application ref success', () => {
            defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                return new Promise(() => {});
            });
            const planetAppRef = getPlanetApplicationRef('app1');
            expect(planetAppRef).toBeTruthy();
            expect(planetAppRef).toBe(window['planet'].apps['app1']);
        });

        it('should not get planet appRef which has not exist', () => {
            defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                return new Promise(() => {});
            });
            const planetAppRef = getPlanetApplicationRef('app2');
            expect(planetAppRef).toBeFalsy();
        });
    });

    describe('ApplicationRef', () => {
        let compiler: Compiler;
        let injector: Injector;

        beforeEach(() => {
            TestBed.configureTestingModule({});
        });

        beforeEach(inject([Compiler, Injector], (_compiler: Compiler, _injector: Injector) => {
            compiler = _compiler;
            injector = _injector;
        }));

        it(`should bootstrap application ref`, fakeAsync(() => {
            const portalApplication = new PlanetPortalApplication();
            const ngModuleFactory = compiler.compileModuleSync(AppModule);
            const ngModuleRef = ngModuleFactory.create(injector);
            defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                return new Promise(resolve => {
                    expect(portalApp).toBe(portalApplication);
                    resolve(ngModuleRef);
                });
            });
            const appRef = getPlanetApplicationRef('app1');
            expect(appRef).toBeTruthy();
            appRef.bootstrap(portalApplication);
        }));

        it(`should sync portal route change when sub app(app1) route navigate`, fakeAsync(() => {
            const portalApplication = new PlanetPortalApplication();
            portalApplication.router = { navigateByUrl: () => {} } as any;
            const navigateByUrlSpy = spyOn(portalApplication.router, 'navigateByUrl');
            const ngModuleFactory = compiler.compileModuleSync(AppModule);
            const ngModuleRef = ngModuleFactory.create(injector);
            defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                return new Promise(resolve => {
                    expect(portalApp).toBe(portalApplication);
                    resolve(ngModuleRef);
                });
            });
            const appRef = getPlanetApplicationRef('app1');
            expect(appRef).toBeTruthy();
            appRef.bootstrap(portalApplication);

            const route = ngModuleRef.injector.get(Router);
            const ngZone = ngModuleRef.injector.get(NgZone);
            ngZone.run(() => {
                route.navigateByUrl('/app1');
            });
            expect(navigateByUrlSpy).not.toHaveBeenCalled();
            ngZone.onStable.next();
            tick();
            expect(navigateByUrlSpy).toHaveBeenCalled();
            expect(navigateByUrlSpy).toHaveBeenCalledWith('/app1');
        }));
    });
});
