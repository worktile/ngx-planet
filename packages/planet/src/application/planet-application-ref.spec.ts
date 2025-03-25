import { PlanetPortalApplication } from './portal-application';
import { NgModule, Compiler, Injector, Component, NgZone, Type, ApplicationConfig, ApplicationRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router, RouterOutlet, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed, inject, tick, fakeAsync, flush } from '@angular/core/testing';
import { defineApplication, getPlanetApplicationRef, clearGlobalPlanet } from '../global-planet';
import { Subject } from 'rxjs';
import { PlanetApplicationRef } from './planet-application-ref';
import { RouterTestingModule } from '@angular/router/testing';
import { NgPlanetApplicationRef } from './ng-planet-application-ref';
import { createElementByTemplate } from '../helpers';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-root',
    template: ` <router-outlet></router-outlet>`,
    imports: [RouterOutlet]
})
class EmptyComponent {}

@NgModule({
    declarations: [],
    imports: [
        EmptyComponent,
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

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-standalone-root',
    template: ` <router-outlet></router-outlet>`,
    imports: [RouterOutlet]
})
class AppComponent {}

export const appConfig: ApplicationConfig = {
    providers: [
        // provideRouter([
        //     {
        //         path: 'app1',
        //         component: EmptyComponent
        //     },
        //     {
        //         path: 'app1/test',
        //         component: EmptyComponent
        //     }
        // ])
    ]
};

export function bootstrapStandaloneApplication() {
    return bootstrapApplication(AppComponent, appConfig);
}

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
        let routerHarness: RouterTestingHarness;

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

            const appRef = getPlanetApplicationRef('app1') as NgPlanetApplicationRef;
            appRef.bootstrap(portalApplication).subscribe();

            flush();
            return {
                router,
                appRef
            };
        }

        beforeEach(async () => {
            TestBed.configureTestingModule({});
            routerHarness = await RouterTestingHarness.create('/');
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
            expect(appRef['appModuleRef']).toEqual(ngModuleRef);
            expect(appRef['appModuleRef'].instance.appName).toEqual('app1');
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

            const appRef = getPlanetApplicationRef('app1') as NgPlanetApplicationRef;
            appRef.bootstrap(portalApplication).subscribe();

            flush();
            expect(appRef.bootstrapped).toEqual(true);
            expect(appRef.appModuleRef).toEqual(ngModuleRef);

            appRef.destroy();
            expect(appRef.bootstrapped).toEqual(false);
            expect(appRef.appModuleRef).toEqual(undefined);
        }));

        it(`should bootstrap standalone application ref`, fakeAsync(() => {
            const portalApplication = new PlanetPortalApplication();
            const element = createElementByTemplate('<app-standalone-root></app-standalone-root>');
            document.body.appendChild(element);
            defineApplication('app-standalone', {
                template: '<app-standalone-root></app-standalone-root>',
                bootstrap: (portalApp?: PlanetPortalApplication) => {
                    return bootstrapStandaloneApplication();
                }
            });
            routerHarness.navigateByUrl('/');
            const planetAppRef = getPlanetApplicationRef('app-standalone');
            expect(planetAppRef).toBeTruthy();
            const bootstrapSpy = jasmine.createSpy('bootstrap spy');
            planetAppRef.bootstrap(portalApplication).subscribe(bootstrapSpy);
            expect(planetAppRef.bootstrapped).toEqual(false);
            flush();
            expect(planetAppRef.bootstrapped).toEqual(true);
            const appRef: ApplicationRef = planetAppRef['appRef'];
            expect(appRef).toBeTruthy();
            expect(appRef instanceof ApplicationRef).toEqual(true);
            expect(bootstrapSpy.calls.count()).toEqual(1);
            expect(bootstrapSpy).toHaveBeenCalled();
            expect(bootstrapSpy).toHaveBeenCalledWith(planetAppRef);
            planetAppRef.destroy();
        }));

        it(`should destroy standalone application ref success`, fakeAsync(() => {
            const portalApplication = new PlanetPortalApplication();
            const element = createElementByTemplate('<app-standalone-root></app-standalone-root>');
            document.body.appendChild(element);
            defineApplication('app-standalone', {
                template: '<app-standalone-root></app-standalone-root>',
                bootstrap: (portalApp?: PlanetPortalApplication) => {
                    return bootstrapStandaloneApplication();
                }
            });
            routerHarness.navigateByUrl('/');
            const planetAppRef = getPlanetApplicationRef('app-standalone');
            expect(planetAppRef).toBeTruthy();
            const bootstrapSpy = jasmine.createSpy('bootstrap spy');
            planetAppRef.bootstrap(portalApplication).subscribe(bootstrapSpy);
            expect(planetAppRef.bootstrapped).toEqual(false);
            flush();
            expect(planetAppRef.bootstrapped).toEqual(true);
            const appRef: ApplicationRef = planetAppRef['appRef'];
            expect(appRef).toBeTruthy();
            expect(appRef instanceof ApplicationRef).toEqual(true);
            expect(bootstrapSpy.calls.count()).toEqual(1);
            expect(bootstrapSpy).toHaveBeenCalled();
            expect(bootstrapSpy).toHaveBeenCalledWith(planetAppRef);
            planetAppRef.destroy();
            expect(planetAppRef.bootstrapped).toEqual(false);
            expect(planetAppRef['appRef']).toEqual(undefined);
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
            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(toUrl, undefined);
        }));

        it(`should navigate to url success with browserUrl `, fakeAsync(() => {
            const routerSpy = {
                navigateByUrl: jasmine.createSpy('navigateByUrl syp'),
                events: new Subject()
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

            expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();

            const toUrl = 'app2/to-url';
            appRef.navigateByUrl('app2/to-url', {
                browserUrl: '/app2/browser-url'
            });

            expect(routerSpy.navigateByUrl).toHaveBeenCalled();
            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(toUrl, {
                browserUrl: '/app2/browser-url'
            });
        }));

        it(`should throw error when app is not defined`, () => {
            expect(() => {
                const appRef = new NgPlanetApplicationRef('app3', {} as any);
                appRef.bootstrap(undefined);
            }).toThrowError(`app(app3) is not defined`);
        });

        it(`should sync portal route change when sub app(app1) route navigate`, fakeAsync(() => {
            const portalApplication = new PlanetPortalApplication();
            portalApplication.ngZone = TestBed.inject(NgZone);
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
            ngZone.onStable.next(null);
            tick();
            expect(navigateByUrlSpy).toHaveBeenCalled();
            expect(navigateByUrlSpy).toHaveBeenCalledWith('/app1');
        }));
    });
});
