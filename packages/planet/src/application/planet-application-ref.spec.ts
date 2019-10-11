import { defineApplication, getPlanetApplicationRef } from './planet-application-ref';
import { PlanetPortalApplication } from './portal-application';
import { platformBrowser } from '@angular/platform-browser';
import { NgModule, NgModuleRef, NgModuleFactory, Compiler, Injector, Component, NgZone } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { async, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';

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
        // delete all apps
        Object.keys(window['planet'].apps).forEach(appName => {
            delete window['planet'].apps[appName];
        });
    });

    describe('defineApplication', () => {
        it('should define application success', () => {
            defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                return new Promise(() => {});
            });
            expect(window['planet'].apps['app1']).toBeTruthy();
        });

        it('should throw error when define application has exist', () => {
            defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                return new Promise(() => {});
            });
            expect(() => {
                defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                    return new Promise(() => {});
                });
            }).toThrowError('app1 application has exist.');
        });
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
