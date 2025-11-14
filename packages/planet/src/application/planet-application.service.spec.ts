import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PlanetApplicationService } from './planet-application.service';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { app1, app2, app2WithPreload } from '../testing/applications';
import { runInInjectionContext, Injector } from '@angular/core';

describe('PlanetApplicationService', () => {
    let planetApplicationService: PlanetApplicationService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
        });
        planetApplicationService = TestBed.inject(PlanetApplicationService);
    });

    it(`should throw error when repeat PlanetApplicationService injection`, () => {
        window['planet'].applicationService = TestBed.inject(PlanetApplicationService);
        const injector = TestBed.inject(Injector);
        runInInjectionContext(injector, () => {
            expect(() => {
                return new PlanetApplicationService();
            }).toThrowError('PlanetApplicationService has been injected in the portal, repeated injection is not allowed');
        });

        window['planet'].applicationService = null;
    });

    describe('register', () => {
        it('should register signal app1 success', () => {
            planetApplicationService.register(app1);
            expect(planetApplicationService.getApps()).toEqual([app1]);
        });

        it('should throw error when register exist app1 ', () => {
            planetApplicationService.register(app1);
            expect(() => {
                planetApplicationService.register(app1);
            }).toThrowError('app1 has be registered.');
        });

        it('should register multiple apps contains app1 and app2 success', () => {
            planetApplicationService.register([app1, app2]);
            expect(planetApplicationService.getApps()).toEqual([app1, app2]);
        });

        describe('registerByUrl', () => {
            let httpClient: HttpClient;
            let httpTestingController: HttpTestingController;
            beforeEach(() => {
                httpClient = TestBed.inject(HttpClient);
                httpTestingController = TestBed.inject(HttpTestingController);
            });

            afterEach(() => {
                // After every test, assert that there are no more pending requests.
                httpTestingController.verify();
            });

            it('should register multiple apps by url', () => {
                planetApplicationService.registerByUrl('/static/apps.json');
                const req = httpTestingController.expectOne('/static/apps.json');

                // Assert that the request is a GET.
                expect(req.request.method).toEqual('GET');

                // Respond with mock data, causing Observable to resolve.
                // Subscribe callback asserts that correct data was returned.
                req.flush([app1, app2]);

                expect(planetApplicationService.getApps()).toEqual([app1, app2]);
            });

            it('should register one app by url', () => {
                planetApplicationService.registerByUrl('/static/apps.json');
                const req = httpTestingController.expectOne('/static/apps.json');
                expect(req.request.method).toEqual('GET');
                req.flush(app1);
                expect(planetApplicationService.getApps()).toEqual([app1]);
            });
        });
    });

    describe('unregister', () => {
        it('should unregister app1 success', () => {
            planetApplicationService.register(app1);
            expect(planetApplicationService.getApps()).toEqual([app1]);
            planetApplicationService.unregister(app1.name);
            expect(planetApplicationService.getApps()).toEqual([]);
        });
    });

    describe('getAppsByMatchedUrl', () => {
        it('should get matched apps(app1) by url app1/dashboard', () => {
            planetApplicationService.register(app1);
            planetApplicationService.register(app2);
            const apps = planetApplicationService.getAppsByMatchedUrl('/app1/dashboard');
            expect(apps).toEqual([app1]);
        });

        it('should get matched apps by url when apps has same routerPathPrefix', () => {
            planetApplicationService.register(app1);
            const app2SameApp1 = { ...app2, routerPathPrefix: '/app1' };
            planetApplicationService.register(app2SameApp1);
            const apps = planetApplicationService.getAppsByMatchedUrl('/app1/dashboard');
            expect(apps).toEqual([app1, app2SameApp1]);
        });

        it('should get empty apps by url __/dashboard/app1 without start with app1', () => {
            planetApplicationService.register(app1);
            planetApplicationService.register(app2);
            const apps = planetApplicationService.getAppsByMatchedUrl('/__/dashboard/app1');
            expect(apps).toEqual([]);
        });

        it('should get matched apps which rule is RegExp("(a\\wp3)|app4") by url app3/dashboard', () => {
            planetApplicationService.register(app1);
            planetApplicationService.register(app2);
            const app3 = {
                ...app1,
                name: 'app3',
                routerPathPrefix: new RegExp('(a\\wp3)|app4')
            };
            planetApplicationService.register(app3);
            const apps = planetApplicationService.getAppsByMatchedUrl('/app3/dashboard');
            expect(apps).toBeTruthy('app is not found');
            expect(apps[0]).toBe(app3);
        });

        it('should get matched apps which rule is /app1 and /app1-dashboard by url /app1-dashboard', () => {
            const app3 = {
                ...app1,
                name: 'app1-dashboard',
                routerPathPrefix: '/app1-dashboard'
            };
            planetApplicationService.register(app3);
            planetApplicationService.register(app1);
            const apps = planetApplicationService.getAppsByMatchedUrl('/app1-dashboard');
            expect(apps).toBeTruthy('app is not found');
            expect(apps.length).toBe(1);
            expect(apps[0]).toBe(app3);

            const appsWithApp1 = planetApplicationService.getAppsByMatchedUrl('/app1');
            expect(appsWithApp1).toBeTruthy('app is not found');
            expect(appsWithApp1.length).toBe(1);
            expect(appsWithApp1[0]).toBe(app1);

            const appsWithApp1Query = planetApplicationService.getAppsByMatchedUrl('/app1?q=1');
            expect(appsWithApp1Query).toBeTruthy('app is not found');
            expect(appsWithApp1Query.length).toBe(1);
            expect(appsWithApp1Query[0]).toBe(app1);

            const appsWithApp1Children = planetApplicationService.getAppsByMatchedUrl('/app1/sub');
            expect(appsWithApp1Children).toBeTruthy('app is not found');
            expect(appsWithApp1Children.length).toBe(1);
            expect(appsWithApp1Children[0]).toBe(app1);

            const appsWithNotFound = planetApplicationService.getAppsByMatchedUrl('/app1-d');
            expect(appsWithNotFound.length).toBe(0);
        });
    });

    describe('getAppsToPreload', () => {
        it('should get correct preload apps', () => {
            planetApplicationService.register(app1);
            planetApplicationService.register(app2WithPreload);
            const appsToPreload = planetApplicationService.getAppsToPreload();
            expect(appsToPreload).toEqual([app2WithPreload]);
        });

        it('should get correct preload apps exclude app names', () => {
            planetApplicationService.register(app1);
            planetApplicationService.register(app2WithPreload);
            const appsToPreload = planetApplicationService.getAppsToPreload(['app2']);
            expect(appsToPreload).toEqual([]);
        });
    });
});
