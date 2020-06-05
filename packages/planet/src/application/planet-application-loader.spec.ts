import { Subject } from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlanetApplicationLoader, ApplicationStatus } from './planet-application-loader';
import { AssetsLoader, AssetsLoadResult } from '../assets-loader';

import { SwitchModes, PlanetApplication } from '../planet.class';
import { PlanetApplicationService } from './planet-application.service';
import { NgZone, Injector, ApplicationRef } from '@angular/core';
import { PlanetApplicationRef } from './planet-application-ref';
import { app1, app2 } from '../test/applications';
import { Planet } from 'ngx-planet/planet';
import { getApplicationLoader, getApplicationService, clearGlobalPlanet, globalPlanet } from 'ngx-planet/global-planet';

class PlanetApplicationRefFaker {
    planetAppRef: PlanetApplicationRef;
    destroySpy: jasmine.Spy;
    bootstrapSpy: jasmine.Spy;
    navigateByUrlSpy: jasmine.Spy;
    getCurrentRouterStateUrlSpy: jasmine.Spy;
    bootstrap$: Subject<PlanetApplicationRef>;

    constructor(appName: string) {
        this.planetAppRef = new PlanetApplicationRef(appName, null);
        this.bootstrapSpy = spyOn(this.planetAppRef, 'bootstrap');
        this.bootstrap$ = new Subject<PlanetApplicationRef>();
        this.bootstrapSpy.and.returnValues(this.bootstrap$, this.bootstrap$);
        this.destroySpy = spyOn(this.planetAppRef, 'destroy');
        this.navigateByUrlSpy = spyOn(this.planetAppRef, 'navigateByUrl');

        this.getCurrentRouterStateUrlSpy = spyOn(this.planetAppRef, 'getCurrentRouterStateUrl');

        (window as any).planet.apps[appName] = this.planetAppRef;
    }

    static create(appName: string) {
        return new PlanetApplicationRefFaker(appName);
    }

    bootstrap() {
        this.bootstrap$.next();
        this.bootstrap$.complete();
    }

    haveBeenBootstrap() {
        expect(this.bootstrapSpy).toHaveBeenCalled();
    }

    haveNotBeenBootstrap() {
        expect(this.bootstrapSpy).not.toHaveBeenCalled();
    }
}

class AppStatusChangeFaker {
    spy: jasmine.Spy;
    planetApplicationLoader: PlanetApplicationLoader;
    constructor(planetApplicationLoader: PlanetApplicationLoader) {
        this.planetApplicationLoader = planetApplicationLoader;
        this.spy = jasmine.createSpy('app status change spy');
        planetApplicationLoader.appStatusChange.subscribe(this.spy);
        expect(this.spy).not.toHaveBeenCalled();
    }

    static create(planetApplicationLoader: PlanetApplicationLoader) {
        return new AppStatusChangeFaker(planetApplicationLoader);
    }

    expectHaveBeenCalledWith(...params: any[]) {
        expect(this.spy).toHaveBeenCalled();
        expect(this.spy).toHaveBeenCalledWith(...params);
    }

    // 封装从资源加载完毕到应用的启动和激活过程，简化每个测试用例重复写很多逻辑
    expectFromAssetsLoadedToActive(
        fromCalledTimes: number,
        appRefFaker: PlanetApplicationRefFaker,
        expectedApp: PlanetApplication
    ) {
        appRefFaker.haveNotBeenBootstrap();
        flush();
        appRefFaker.haveBeenBootstrap();
        expect(this.spy).toHaveBeenCalledTimes(fromCalledTimes + 1);
        expect(this.spy).toHaveBeenCalledWith({ app: expectedApp, status: ApplicationStatus.bootstrapping });
        expect(this.planetApplicationLoader.loadingDone).toBe(false);
        appRefFaker.bootstrap();
        expect(this.planetApplicationLoader.loadingDone).toBe(true);
        expect(this.spy).toHaveBeenCalledTimes(fromCalledTimes + 3);

        expect(this.spy).toHaveBeenCalledWith({ app: expectedApp, status: ApplicationStatus.bootstrapped });
        expect(this.spy).toHaveBeenCalledWith({ app: expectedApp, status: ApplicationStatus.active });
    }
}

describe('PlanetApplicationLoader', () => {
    let planetApplicationLoader: PlanetApplicationLoader;
    let planetApplicationService: PlanetApplicationService;
    let assetsLoader: AssetsLoader;
    let ngZone: NgZone;
    let planet: Planet;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterModule.forRoot([])]
        });
        planet = TestBed.inject(Planet);
        planetApplicationLoader = getApplicationLoader();
        planetApplicationService = getApplicationService();
        assetsLoader = TestBed.inject(AssetsLoader);
        ngZone = TestBed.inject(NgZone);

        planetApplicationService.register(app1);
        planetApplicationService.register(app2);

        // 创建宿主容器
        const hostContainer = document.createElement('DIV');
        hostContainer.classList.add('host-selector');
        document.body.appendChild(hostContainer);
    });

    afterEach(() => {
        clearGlobalPlanet();
    });

    it(`should repeat injection not allowed`, () => {
        expect(() => {
            return new PlanetApplicationLoader(
                TestBed.inject(AssetsLoader),
                TestBed.inject(PlanetApplicationService),
                TestBed.inject(NgZone),
                TestBed.inject(Router),
                TestBed.inject(Injector),
                TestBed.inject(ApplicationRef)
            );
        }).toThrowError('PlanetApplicationLoader has been injected in the portal, repeated injection is not allowed');
    });

    it(`should load (load assets and bootstrap) app1 success`, fakeAsync(() => {
        const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValue(loadAppAssets$);

        const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);

        // App state change
        const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);

        // Apps loading start
        const appsLoadingStartSpy = jasmine.createSpy('apps loading start spy');
        planetApplicationLoader.appsLoadingStart.subscribe(appsLoadingStartSpy);
        expect(appsLoadingStartSpy).not.toHaveBeenCalled();

        planetApplicationLoader.reroute({ url: '/app1/dashboard' });

        appStatusChangeFaker.expectHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });
        expect(planetApplicationLoader.loadingDone).toBe(false);

        expect(appsLoadingStartSpy).toHaveBeenCalled();
        expect(appsLoadingStartSpy).toHaveBeenCalledWith({
            shouldLoadApps: [app1],
            shouldUnloadApps: []
        });
        loadAppAssets$.next();
        loadAppAssets$.complete();

        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(2);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoaded });

        appStatusChangeFaker.expectFromAssetsLoadedToActive(2, app1RefFaker, app1);

        // 判断是否在宿主元素中创建了应用根节点
        expectApp1Element();

        tick();
    }));

    it(`should not bootstrap app1 which is active`, fakeAsync(() => {
        const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValue(loadAppAssets$);

        const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);
        const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);

        planetApplicationLoader.reroute({ url: '/app1/dashboard' });
        loadAppAssets$.next();
        loadAppAssets$.complete();
        flush();
        app1RefFaker.haveBeenBootstrap();
        app1RefFaker.bootstrap();

        // 判断是否在宿主元素中创建了应用根节点
        expectApp1Element();

        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(5);
        planetApplicationLoader.reroute({ url: '/app1/dashboard2' });
        flush();
        expect(app1RefFaker.bootstrapSpy).toHaveBeenCalledTimes(1);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(5);
        tick();
    }));

    it(`should call app1 navigateByUrl when app1 is active`, fakeAsync(() => {
        const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValue(loadAppAssets$);

        const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);
        const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);

        planetApplicationLoader.reroute({ url: '/app1/dashboard' });
        loadAppAssets$.next();
        loadAppAssets$.complete();
        flush();
        app1RefFaker.haveBeenBootstrap();
        app1RefFaker.bootstrap();

        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(5);
        expect(app1RefFaker.navigateByUrlSpy).not.toHaveBeenCalled();
        planetApplicationLoader.reroute({ url: '/app1/dashboard2' });
        flush();
        expect(app1RefFaker.navigateByUrlSpy).toHaveBeenCalledTimes(1);
        expect(app1RefFaker.navigateByUrlSpy).toHaveBeenCalledWith('/app1/dashboard2');
        tick();
    }));

    it(`should not call app1 navigateByUrl when app1 is active and url is same`, fakeAsync(() => {
        const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValue(loadAppAssets$);

        const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);
        const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);
        planetApplicationLoader.reroute({ url: '/app1/dashboard' });
        loadAppAssets$.next();
        loadAppAssets$.complete();
        flush();
        app1RefFaker.haveBeenBootstrap();
        app1RefFaker.bootstrap();

        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(5);
        expect(app1RefFaker.navigateByUrlSpy).not.toHaveBeenCalled();
        app1RefFaker.getCurrentRouterStateUrlSpy.and.returnValue('/app1/dashboard2');
        planetApplicationLoader.reroute({ url: '/app1/dashboard2' });
        flush();
        expect(app1RefFaker.navigateByUrlSpy).not.toHaveBeenCalled();
        tick();
    }));

    it(`should start load app1 once when reroute same url: /app1/dashboard`, fakeAsync(() => {
        const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValue(loadAppAssets$);

        // Apps loading start
        const appsLoadingStartSpy = jasmine.createSpy('apps loading start spy');
        planetApplicationLoader.appsLoadingStart.subscribe(appsLoadingStartSpy);
        expect(appsLoadingStartSpy).not.toHaveBeenCalled();

        planetApplicationLoader.reroute({ url: '/app1/dashboard' });
        expect(appsLoadingStartSpy).toHaveBeenCalledTimes(1);
        expect(appsLoadingStartSpy).toHaveBeenCalled();
        expect(appsLoadingStartSpy).toHaveBeenCalledWith({
            shouldLoadApps: [app1],
            shouldUnloadApps: []
        });
        planetApplicationLoader.reroute({ url: '/app1/dashboard' });
        expect(appsLoadingStartSpy).toHaveBeenCalledTimes(1);
        tick();
    }));

    it(`should cancel load app1 which assets has not loaded when next route (app2) change`, fakeAsync(() => {
        const loadApp1Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const loadApp2Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();

        const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);
        const app2RefFaker = PlanetApplicationRefFaker.create(app2.name);

        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp2Assets$);

        const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);

        expect(appStatusChangeFaker.spy).not.toHaveBeenCalled();
        planetApplicationLoader.reroute({ url: '/app1' });
        expect(appStatusChangeFaker.spy).toHaveBeenCalled();
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

        planetApplicationLoader.reroute({ url: '/app2' });
        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(2);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.assetsLoading });
        loadApp1Assets$.next();
        loadApp1Assets$.complete();
        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(2);
        loadApp2Assets$.next();
        loadApp2Assets$.complete();

        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(3);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.assetsLoaded });

        appStatusChangeFaker.expectFromAssetsLoadedToActive(3, app2RefFaker, app2);
        app1RefFaker.haveNotBeenBootstrap();
        app2RefFaker.haveBeenBootstrap();

        tick();
    }));

    it(`should cancel load app1 which has not bootstrapped when next route (app2) change`, fakeAsync(() => {
        const loadApp1Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const loadApp2Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();

        const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);
        const app2RefFaker = PlanetApplicationRefFaker.create(app2.name);

        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp2Assets$);

        const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);

        expect(appStatusChangeFaker.spy).not.toHaveBeenCalled();
        planetApplicationLoader.reroute({ url: '/app1' });
        expect(appStatusChangeFaker.spy).toHaveBeenCalled();
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

        loadApp1Assets$.next();
        loadApp1Assets$.complete();

        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(2);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoaded });

        planetApplicationLoader.reroute({ url: '/app2' });
        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(3);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.assetsLoading });

        loadApp2Assets$.next();
        loadApp2Assets$.complete();

        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(4);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.assetsLoaded });

        appStatusChangeFaker.expectFromAssetsLoadedToActive(4, app2RefFaker, app2);
        app1RefFaker.haveNotBeenBootstrap();
        app2RefFaker.haveBeenBootstrap();

        tick();
    }));

    it(`should load next app(app2) when last app(app1) load error`, fakeAsync(() => {
        const loadApp1Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const loadApp2Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();

        const errorHandlerSpy = jasmine.createSpy(`error handler spy`);
        planetApplicationLoader.setOptions({
            errorHandler: errorHandlerSpy
        });

        const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);
        const app2RefFaker = PlanetApplicationRefFaker.create(app2.name);

        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp2Assets$);

        const appStatusChangeSpy = jasmine.createSpy('app status change spy');
        planetApplicationLoader.appStatusChange.subscribe(appStatusChangeSpy);

        expect(appStatusChangeSpy).not.toHaveBeenCalled();
        planetApplicationLoader.reroute({ url: '/app1' });
        expect(appStatusChangeSpy).toHaveBeenCalled();
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

        expect(errorHandlerSpy).not.toHaveBeenCalled();

        // Load Error
        loadApp1Assets$.error(new Error(`load app1 assets error`));
        loadApp1Assets$.complete();

        expect(errorHandlerSpy).toHaveBeenCalled();
        expect(errorHandlerSpy).toHaveBeenCalledWith(new Error(`load app1 assets error`));

        planetApplicationLoader.reroute({ url: '/app2' });
        expect(appStatusChangeSpy).toHaveBeenCalledTimes(3);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.assetsLoading });

        loadApp2Assets$.next();
        loadApp2Assets$.complete();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(4);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.assetsLoaded });

        flush();
        app2RefFaker.bootstrap();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(7);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.bootstrapping });
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.bootstrapped });
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.active });

        app1RefFaker.haveNotBeenBootstrap();
        app2RefFaker.haveBeenBootstrap();

        // 判断是否在宿主元素中创建了应用根节点
        expectApp2Element();
        tick();
    }));

    it(`should reload app(app1) when before app(app1) load error`, fakeAsync(() => {
        const loadApp1Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const loadApp1AginAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();

        const errorHandlerSpy = jasmine.createSpy(`error handler spy`);
        planetApplicationLoader.setOptions({
            errorHandler: errorHandlerSpy
        });

        const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);

        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp1AginAssets$);

        const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);

        expect(appStatusChangeFaker.spy).not.toHaveBeenCalled();
        planetApplicationLoader.reroute({ url: '/app1' });
        expect(appStatusChangeFaker.spy).toHaveBeenCalled();
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

        expect(errorHandlerSpy).not.toHaveBeenCalled();

        // Load Error
        loadApp1Assets$.error(new Error(`load app1 assets error`));
        loadApp1Assets$.complete();

        expect(errorHandlerSpy).toHaveBeenCalled();
        expect(errorHandlerSpy).toHaveBeenCalledWith(new Error(`load app1 assets error`));

        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(2);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.loadError });

        planetApplicationLoader.reroute({ url: '/app1/hello' });
        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(3);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

        loadApp1AginAssets$.next();
        loadApp1AginAssets$.complete();

        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(4);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoaded });

        appStatusChangeFaker.expectFromAssetsLoadedToActive(4, app1RefFaker, app1);

        app1RefFaker.haveBeenBootstrap();

        // 判断是否在宿主元素中创建了应用根节点
        expectApp1Element();

        tick();
    }));

    describe('preload', () => {
        it(`should preload load app2 when after loaded app1`, fakeAsync(() => {
            const newApp2 = {
                ...app2,
                preload: true
            };

            planetApplicationService.unregister(app2.name);
            planetApplicationService.register(newApp2);

            const loadApp1Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
            const loadApp2Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();

            const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);
            const app2RefFaker = PlanetApplicationRefFaker.create(newApp2.name);

            const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
            assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp2Assets$);

            const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);

            expect(appStatusChangeFaker.spy).not.toHaveBeenCalled();
            planetApplicationLoader.reroute({ url: '/app1' });

            // Start load app1 assets
            expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(1);
            expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({
                app: app1,
                status: ApplicationStatus.assetsLoading
            });

            loadApp1Assets$.next();
            loadApp1Assets$.complete();

            // App1 assets loaded
            expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(2);
            expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({
                app: app1,
                status: ApplicationStatus.assetsLoaded
            });

            // bootstrap app1 in setTimeout
            flush();

            // Start bootstrap app1
            expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(3);
            expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({
                app: app1,
                status: ApplicationStatus.bootstrapping
            });
            expect(planetApplicationLoader.loadingDone).toBe(false);

            // App1 Ref Faker spy bootstrap
            app1RefFaker.bootstrap();

            // App1 bootstrapped
            expect(planetApplicationLoader.loadingDone).toBe(true);
            expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(5);
            expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({
                app: app1,
                status: ApplicationStatus.bootstrapped
            });
            expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.active });

            app2RefFaker.haveNotBeenBootstrap();

            // Preload app2 in setTimeout
            tick();

            // 已经开始加载 App2 静态资源
            expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(6);
            expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({
                app: newApp2,
                status: ApplicationStatus.assetsLoading
            });

            // App2 静态资源加载完毕
            loadApp2Assets$.next();
            loadApp2Assets$.complete();

            // App2 's assets loaded
            expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(7);
            expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({
                app: newApp2,
                status: ApplicationStatus.assetsLoaded
            });

            // onStable
            ngZone.onStable.next();

            // App2 start bootstrap
            expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(8);
            expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({
                app: newApp2,
                status: ApplicationStatus.bootstrapping
            });

            // App2 bootstrapped
            app2RefFaker.bootstrap();
            expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(9);
            expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({
                app: newApp2,
                status: ApplicationStatus.bootstrapped
            });
            tick();
        }));

        it(`should throw error when preload load app2 error`, fakeAsync(() => {
            const newApp2 = {
                ...app2,
                preload: true
            };

            planetApplicationService.unregister(app2.name);
            planetApplicationService.register(newApp2);

            const loadApp1Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
            const loadApp2Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();

            const errorHandlerSpy = jasmine.createSpy(`error handler spy`);
            planetApplicationLoader.setOptions({
                errorHandler: errorHandlerSpy
            });

            const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);
            const app2RefFaker = PlanetApplicationRefFaker.create(newApp2.name);

            const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
            assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp2Assets$);

            const appStatusChangeSpy = jasmine.createSpy('app status change spy');
            planetApplicationLoader.appStatusChange.subscribe(appStatusChangeSpy);

            expect(appStatusChangeSpy).not.toHaveBeenCalled();
            planetApplicationLoader.reroute({ url: '/app1' });
            expect(appStatusChangeSpy).toHaveBeenCalledTimes(1);
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

            loadApp1Assets$.next();
            loadApp1Assets$.complete();

            expect(appStatusChangeSpy).toHaveBeenCalledTimes(2);
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoaded });

            app1RefFaker.haveNotBeenBootstrap();
            flush();
            expect(appStatusChangeSpy).toHaveBeenCalledTimes(3);
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.bootstrapping });
            app1RefFaker.bootstrap();
            app1RefFaker.haveBeenBootstrap();
            expect(appStatusChangeSpy).toHaveBeenCalledTimes(5);
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.bootstrapped });
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.active });

            flush();
            loadApp2Assets$.error(new Error(`load newApp2 assets error`));
            loadApp2Assets$.complete();
            expect(errorHandlerSpy).toHaveBeenCalled();
            expect(errorHandlerSpy).toHaveBeenCalledWith(new Error(`load newApp2 assets error`));
        }));
    });

    function expectApp1Element() {
        const app1Host = document.querySelector(app1.selector);
        expect(app1Host).toBeTruthy();
        expect(app1Host.outerHTML).toEqual(`<app1-root-container class="app1-host"></app1-root-container>`);
    }

    function expectApp2Element() {
        const app2Host = document.querySelector(app2.selector);
        expect(app2Host).toBeTruthy();
        expect(app2Host.outerHTML).toEqual(`<app2-root-container class="app2-host"></app2-root-container>`);
    }
});
