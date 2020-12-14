import { PlanetPortalApplication } from './portal-application';
import { NgModule, Compiler, Injector, Component, NgZone, Type } from '@angular/core';
import { Router } from '@angular/router';
import { TestBed, inject, tick, fakeAsync, flush } from '@angular/core/testing';
import { defineApplication, getPlanetApplicationRef, clearGlobalPlanet } from '../global-planet';
import { Subject } from 'rxjs';
import { PlanetApplicationRef } from './planet-application-ref';
import { RouterTestingModule } from '@angular/router/testing';

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
        RouterTestingModule.withRoutes([
            {
                path: 'app1',
                component: EmptyComponent
            },
            {
                path: 'app1/test',
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
            defineApplication('app1', {
                template: '<app1-root></app1-root>',
                bootstrap: (portalApp?: PlanetPortalApplication) => {
                    return new Promise(() => {});
                }
            });
            const planetAppRef = getPlanetApplicationRef('app1');
            expect(planetAppRef).toBeTruthy();
            expect(planetAppRef).toBe(window['planet'].apps['app1']);
        });

        it('should not get planet appRef which has not exist', () => {
            defineApplication('app1', {
                template: '<app1-root></app1-root>',
                bootstrap: (portalApp?: PlanetPortalApplication) => {
                    return new Promise(() => {});
                }
            });
            const planetAppRef = getPlanetApplicationRef('app2');
            expect(planetAppRef).toBeFalsy();
        });
    });

    describe('ApplicationRef', () => {
        let compiler: Compiler;
        let injector: Injector;

        function bootstrapApp1<T>(moduleType?: Type<T>) {
            const portalApplication = new PlanetPortalApplication();
            const ngModuleFactory = compiler.compileModuleSync(moduleType ? moduleType : AppModule);
            const ngModuleRef = ngModuleFactory.create(injector);
            const router = ngModuleRef.injector.get(Router);
            defineApplication('app1', {
                template: '<app1-root></app1-root>',
                bootstrap: (portalApp?: PlanetPortalApplication) => {
                    return new Promise(resolve => {
                        expect(portalApp).toBe(portalApplication);
                        resolve(ngModuleRef);
                    });
                }
            });

            const appRef = getPlanetApplicationRef('app1');
            appRef.bootstrap(portalApplication).subscribe();

            flush();
            return {
                router,
                appRef
            };
        }

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
            defineApplication('app1', {
                template: '<app1-root></app1-root>',
                bootstrap: (portalApp?: PlanetPortalApplication) => {
                    return new Promise(resolve => {
                        expect(portalApp).toBe(portalApplication);
                        resolve(ngModuleRef);
                    });
                }
            });
            const appRef = getPlanetApplicationRef('app1');
            expect(appRef).toBeTruthy();
            const bootstrapSpy = jasmine.createSpy('bootstrap spy');
            appRef.bootstrap(portalApplication).subscribe(bootstrapSpy);
            expect(appRef.bootstrapped).toEqual(false);
            flush();
            expect(appRef.bootstrapped).toEqual(true);
            expect(appRef.appModuleRef).toEqual(ngModuleRef);
            expect(appRef.appModuleRef.instance.appName).toEqual('app1');
            expect(bootstrapSpy.calls.count()).toEqual(1);
            expect(bootstrapSpy).toHaveBeenCalled();
            expect(bootstrapSpy).toHaveBeenCalledWith(appRef);
        }));

        it(`should destroy application ref success`, fakeAsync(() => {
            const portalApplication = new PlanetPortalApplication();
            const ngModuleFactory = compiler.compileModuleSync(AppModule);
            const ngModuleRef = ngModuleFactory.create(injector);
            const router = ngModuleRef.injector.get(Router);
            defineApplication('app1', {
                template: '<app1-root></app1-root>',
                bootstrap: (portalApp?: PlanetPortalApplication) => {
                    return new Promise(resolve => {
                        expect(portalApp).toBe(portalApplication);
                        resolve(ngModuleRef);
                    });
                }
            });

            const appRef = getPlanetApplicationRef('app1');
            appRef.bootstrap(portalApplication).subscribe();

            flush();
            expect(appRef.bootstrapped).toEqual(true);
            expect(appRef.appModuleRef).toEqual(ngModuleRef);

            appRef.destroy();
            expect(appRef.bootstrapped).toEqual(false);
            expect(appRef.appModuleRef).toEqual(undefined);
        }));

        it(`should get router success`, fakeAsync(() => {
            const { appRef, router } = bootstrapApp1();
            expect(appRef.getRouter()).toBeTruthy();
            expect(appRef.getRouter()).toEqual(router);
        }));

        it(`should navigate to url success and get correct current router state url `, fakeAsync(() => {
            const routerSpy = {
                navigateByUrl: jasmine.createSpy('navigateByUrl syp'),
                events: new Subject(),
                routerState: {
                    snapshot: {
                        url: 'app1/hello'
                    }
                }
            };
            @NgModule({
                declarations: [],
                imports: [],
                providers: [
                    {
                        provide: Router,
                        useValue: routerSpy
                    }
                ]
            })
            class AppModuleWithSpyRouter {}
            const { appRef } = bootstrapApp1(AppModuleWithSpyRouter);
            expect(appRef.getCurrentRouterStateUrl()).toEqual('app1/hello');

            expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();

            const toUrl = 'app2/to-url';
            appRef.navigateByUrl('app2/to-url');

            expect(routerSpy.navigateByUrl).toHaveBeenCalled();
            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(toUrl);
        }));

        it(`should throw error when app is not defined`, () => {
            expect(() => {
                const appRef = new PlanetApplicationRef('app3', {} as any);
                appRef.bootstrap(undefined);
            }).toThrowError(`app(app3) is not defined`);
        });

        it(`should sync portal route change when sub app(app1) route navigate`, fakeAsync(() => {
            const portalApplication = new PlanetPortalApplication();
            portalApplication.router = { navigateByUrl: () => {} } as any;
            const navigateByUrlSpy = spyOn(portalApplication.router, 'navigateByUrl');
            const ngModuleFactory = compiler.compileModuleSync(AppModule);
            const ngModuleRef = ngModuleFactory.create(injector);
            defineApplication('app1', {
                template: '<app1-root></app1-root>',
                bootstrap: (portalApp?: PlanetPortalApplication) => {
                    return new Promise(resolve => {
                        expect(portalApp).toBe(portalApplication);
                        resolve(ngModuleRef);
                    });
                }
            });
            const appRef = getPlanetApplicationRef('app1');
            expect(appRef).toBeTruthy();
            appRef.bootstrap(portalApplication);

            const router = ngModuleRef.injector.get(Router);
            const ngZone = ngModuleRef.injector.get(NgZone);
            ngZone.run(() => {
                router.navigateByUrl('/app1');
            });
            expect(navigateByUrlSpy).not.toHaveBeenCalled();
            ngZone.onStable.next();
            tick();
            expect(navigateByUrlSpy).toHaveBeenCalled();
            expect(navigateByUrlSpy).toHaveBeenCalledWith('/app1');
        }));
    });
});
