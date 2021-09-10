import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlanetApplicationLoader, ApplicationStatus } from './planet-application-loader';
import { AssetsLoader, AssetsLoadResult } from '../assets-loader';
import { SwitchModes, PlanetApplication } from '../planet.class';
import { PlanetApplicationService } from './planet-application.service';
import { NgZone, Injector, ApplicationRef } from '@angular/core';
import { BootstrapOptions, PlanetApplicationRef } from './planet-application-ref';
import { app1, app2 } from '../testing/applications';
import { Planet } from 'ngx-planet/planet';
import { getApplicationLoader, getApplicationService, clearGlobalPlanet } from 'ngx-planet/global-planet';
import { RouterTestingModule } from '@angular/router/testing';
import { sample } from '../testing/utils';

class PlanetApplicationRefFaker {
    planetAppRef: PlanetApplicationRef;
    destroySpy: jasmine.Spy;
    bootstrapSpy: jasmine.Spy;
    navigateByUrlSpy: jasmine.Spy;
    getCurrentRouterStateUrlSpy: jasmine.Spy;
    bootstrap$: Subject<PlanetApplicationRef>;

    constructor(appName: string, options?: BootstrapOptions) {
        this.planetAppRef = new PlanetApplicationRef(appName, options);
        this.bootstrapSpy = spyOn(this.planetAppRef, 'bootstrap');
        this.bootstrap$ = new Subject<PlanetApplicationRef>();
        this.bootstrapSpy.and.returnValues(this.bootstrap$, this.bootstrap$);
        this.destroySpy = spyOn(this.planetAppRef, 'destroy');
        this.navigateByUrlSpy = spyOn(this.planetAppRef, 'navigateByUrl');

        this.getCurrentRouterStateUrlSpy = spyOn(this.planetAppRef, 'getCurrentRouterStateUrl');

        (window as any).planet.apps[appName] = this.planetAppRef;
    }

    static create(appName: string, options?: BootstrapOptions) {
        return new PlanetApplicationRefFaker(appName, options);
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

    status = new Map<string, ApplicationStatus>();

    constructor(planetApplicationLoader: PlanetApplicationLoader) {
        this.planetApplicationLoader = planetApplicationLoader;
        this.spy = jasmine.createSpy('app status change spy');
        planetApplicationLoader.appStatusChange.subscribe(data => {
            this.spy(data);
            this.status.set(data.app.name, data.status);
        });
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

    expectAppStatus(appName: string, expectedStatus: ApplicationStatus) {
        const status = this.status.get(appName);
        expect(status).toEqual(expectedStatus, `${appName} status is ${status}`);
    }
}

describe('PlanetApplicationLoader', () => {
    let planetApplicationLoader: PlanetApplicationLoader;
    let planetApplicationService: PlanetApplicationService;
    let assetsLoader: AssetsLoader;
    let ngZone: NgZone;
    let planet: Planet;

    function expectApp1Element(classesStr = 'app1-host app1-prefix') {
        const app1Host = document.querySelector(app1.selector);
        expect(app1Host).toBeTruthy();
        expect(app1Host.outerHTML).toEqual(`<app1-root class="${classesStr}"></app1-root>`);
    }

    function expectApp2Element() {
        const app2Host = document.querySelector(app2.selector);
        expect(app2Host).toBeTruthy();
        expect(app2Host.outerHTML).toEqual(`<app2-root class="app2-host"></app2-root>`);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])]
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
        planetApplicationLoader['destroyApp'](app1);
        planetApplicationLoader['destroyApp'](app2);
    });

    it(`should throw error for PlanetApplicationLoader guard when has multiple instances`, () => {
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

    it(`should load (load assets and bootstrap) app1 success for legacy selector`, fakeAsync(() => {
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

    it(`should load (load assets and bootstrap) app1 success use template`, fakeAsync(() => {
        const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValue(loadAppAssets$);
        const app1RefFaker = PlanetApplicationRefFaker.create(app1.name, {
            template: `<app1-root class="app1-root"></app1-root>`,
            bootstrap: null
        });

        // App state change
        const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);

        // Apps loading start
        const appsLoadingStartSpy = jasmine.createSpy('apps loading start spy');
        planetApplicationLoader.appsLoadingStart.subscribe(appsLoadingStartSpy);
        planetApplicationLoader.reroute({ url: '/app1/dashboard' });
        loadAppAssets$.next();
        loadAppAssets$.complete();
        appStatusChangeFaker.expectFromAssetsLoadedToActive(2, app1RefFaker, app1);

        // 判断是否在宿主元素中创建了应用根节点
        expectApp1Element(`app1-root app1-host app1-prefix`);

        tick();
    }));

    it(`should load empty apps when route navigate to '/app-not-found/dashboard'`, fakeAsync(() => {
        const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValue(loadAppAssets$);

        // Apps loading start
        const appsLoadingStartSpy = jasmine.createSpy('apps loading start spy');
        planetApplicationLoader.appsLoadingStart.subscribe(appsLoadingStartSpy);
        planetApplicationLoader.reroute({ url: '/app-not-found/dashboard' });

        expect(appsLoadingStartSpy).toHaveBeenCalledTimes(1);
        expect(appsLoadingStartSpy).toHaveBeenCalledWith({
            shouldLoadApps: [],
            shouldUnloadApps: []
        });
        expect(planetApplicationLoader.loadingDone).toEqual(true);

        loadAppAssets$.next();
        loadAppAssets$.complete();

        expect(planetApplicationLoader.loadingDone).toEqual(true);
        expect(appsLoadingStartSpy).toHaveBeenCalledTimes(1);

        flush();
    }));

    it(`should not update loadingDone to false when app1 url navigate and app1 has been active`, fakeAsync(() => {
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

        // app1 has been loaded
        expect(planetApplicationLoader.loadingDone).toEqual(true);
        flush();

        // app2 has been not loaded
        planetApplicationLoader.reroute({ url: '/app2/dashboard1' });
        expect(planetApplicationLoader.loadingDone).toEqual(false);
        flush();
    }));

    it(`should not bootstrap app1 when app1 is active`, fakeAsync(() => {
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

        expect(app1RefFaker.bootstrapSpy).toHaveBeenCalledTimes(1);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(5);
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
    }));

    it(`should hide app1 success when app1 is not match and switch mode is default`, fakeAsync(() => {
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

        loadAppAssets$.next();
        loadAppAssets$.complete();

        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(2);
        expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoaded });

        appStatusChangeFaker.expectFromAssetsLoadedToActive(2, app1RefFaker, app1);

        tick();
        const app1Host = document.querySelector(app1.selector);
        planetApplicationLoader.reroute({ url: '/app2/dashboard' });
        expect(app1Host.getAttribute('style')).toContain('display:none;');
        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(7);
        tick();
        // restore status to assetsLoaded when switch mode is default
        appStatusChangeFaker.expectAppStatus(app1.name, ApplicationStatus.assetsLoaded);
        expect(document.querySelector(app1.selector)).toBeFalsy();
    }));

    it(`should destroy app1 success when app1 is not match and switch mode is coexist`, fakeAsync(() => {
        const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValue(loadAppAssets$);
        app1.switchMode = SwitchModes.coexist;
        const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);

        // App state change
        const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);

        // Apps loading start
        const appsLoadingStartSpy = jasmine.createSpy('apps loading start spy');
        planetApplicationLoader.appsLoadingStart.subscribe(appsLoadingStartSpy);
        expect(appsLoadingStartSpy).not.toHaveBeenCalled();

        planetApplicationLoader.reroute({ url: '/app1/dashboard' });

        loadAppAssets$.next();
        loadAppAssets$.complete();

        appStatusChangeFaker.expectFromAssetsLoadedToActive(2, app1RefFaker, app1);

        tick();

        const app1Host = document.querySelector(app1.selector);
        planetApplicationLoader.reroute({ url: '/app2/dashboard' });
        expect(app1Host.getAttribute('style')).toContain('display:none;');
        expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(7);

        tick();

        // restore status to bootstrapped when switch mode is coexist
        appStatusChangeFaker.expectAppStatus(app1.name, ApplicationStatus.bootstrapped);
        app1.switchMode = SwitchModes.default;
        expect(document.querySelector(app1.selector)).toBeTruthy();
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

    it(`should reload sub app when sub app is bootstrapped`, fakeAsync(() => {
        const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();

        const appRefFaker = PlanetApplicationRefFaker.create(app2.name);

        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValues(loadAppAssets$);

        const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);

        planetApplicationLoader.reroute({ url: '/app2' });

        loadAppAssets$.next();
        loadAppAssets$.complete();

        appStatusChangeFaker.expectFromAssetsLoadedToActive(2, appRefFaker, app2);

        tick();

        appStatusChangeFaker.expectAppStatus(app2.name, ApplicationStatus.active);
        planetApplicationLoader.reroute({ url: '/dashboard' });

        tick();

        appStatusChangeFaker.expectAppStatus(app2.name, ApplicationStatus.bootstrapped);
        planetApplicationLoader.reroute({ url: '/app2' });

        tick();

        appStatusChangeFaker.expectAppStatus(app2.name, ApplicationStatus.active);
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

    it(`should throw specify error when sub app not found in bootstrapApp`, () => {
        const appNotFound = 'app100';
        expect(() => {
            planetApplicationLoader['bootstrapApp']({ name: appNotFound, routerPathPrefix: 'app100', hostParent: '' });
        }).toThrowError(
            `[${appNotFound}] not found, make sure that the app has the correct name defined use defineApplication(${appNotFound}) and runtimeChunk and vendorChunk are set to true, details see https://github.com/worktile/ngx-planet#throw-error-cannot-read-property-call-of-undefined-at-__webpack_require__-bootstrap79`
        );
    });

    describe('error handler', () => {
        it(`default error handler`, () => {
            const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
            const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
            assetsLoaderSpy.and.returnValue(loadAppAssets$);

            planetApplicationLoader.reroute({ url: '/app1/dashboard' });

            loadAppAssets$.error('load app assets error');
        });

        it(`custom error handler`, () => {
            const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
            const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
            assetsLoaderSpy.and.returnValue(loadAppAssets$);

            planetApplicationLoader.reroute({ url: '/app1/dashboard' });

            const errorHandlerSpy = jasmine.createSpy(`error handler spy`);
            planetApplicationLoader.setOptions({
                errorHandler: errorHandlerSpy
            });

            const error = new Error(`load app assets error`);
            loadAppAssets$.error(error);
            loadAppAssets$.complete();

            expect(errorHandlerSpy).toHaveBeenCalled();
            expect(errorHandlerSpy).toHaveBeenCalledWith(error);
        });
    });

    describe('switchModeIsCoexist', () => {
        it('default switchModeIsCoexist = false', () => {
            const result = planetApplicationLoader['switchModeIsCoexist'](undefined);
            expect(result).toEqual(false);
        });

        it('default switchModeIsCoexist = true', () => {
            const result = planetApplicationLoader['switchModeIsCoexist']({
                name: 'app100',
                switchMode: SwitchModes.coexist,
                routerPathPrefix: '',
                hostParent: undefined
            });
            expect(result).toEqual(true);
        });

        it('default switchModeIsCoexist = true', () => {
            planetApplicationLoader.setOptions({
                switchMode: SwitchModes.coexist
            });
            const result = planetApplicationLoader['switchModeIsCoexist'](undefined);
            expect(result).toEqual(true);
        });
    });

    describe('preload', () => {
        it(`should auto preload load app2 when after loaded app1`, fakeAsync(() => {
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

            // App2 's assets loaded and bootstrapped
            expect(appStatusChangeFaker.spy).toHaveBeenCalledTimes(8);
            expect(appStatusChangeFaker.spy).toHaveBeenCalledWith({
                app: newApp2,
                status: ApplicationStatus.assetsLoaded
            });
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

        it(`should active app1 success when app1 is bootstrapping by preload`, fakeAsync(() => {
            const newApp1 = {
                ...app1,
                preload: true
            };

            planetApplicationService.unregister(app1.name);
            planetApplicationService.register(newApp1);

            const loadApp1Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
            const loadApp2Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();

            const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);

            const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
            assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp2Assets$);

            const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);

            expect(appStatusChangeFaker.spy).not.toHaveBeenCalled();
            planetApplicationLoader.reroute({ url: '/dashboard' });

            flush();
            loadApp1Assets$.next();
            loadApp1Assets$.complete();

            planetApplicationLoader.reroute({ url: '/app1' });

            flush();

            // 测试在 app1 被预加载处于 bootstrapping 状态，然后路由跳转加载 app1 订阅 bootstrapped 事件后激活应用
            app1RefFaker.bootstrap();

            appStatusChangeFaker.expectAppStatus('app1', ApplicationStatus.active);
        }));

        it(`should active app1 success when app1 is bootstrapping by preload and bootstrapped in setTimeout`, fakeAsync(() => {
            const newApp1 = {
                ...app1,
                preload: true
            };

            planetApplicationService.unregister(app1.name);
            planetApplicationService.register(newApp1);

            const loadApp1Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
            const loadApp2Assets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();

            const app1RefFaker = PlanetApplicationRefFaker.create(app1.name);

            const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
            assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp2Assets$);

            const appStatusChangeFaker = AppStatusChangeFaker.create(planetApplicationLoader);

            expect(appStatusChangeFaker.spy).not.toHaveBeenCalled();
            planetApplicationLoader.reroute({ url: '/dashboard' });

            flush();
            loadApp1Assets$.next();
            loadApp1Assets$.complete();

            planetApplicationLoader.reroute({ url: '/app1' });
            // It must be bootstrap first and then flush (setTimeout)
            // Because app1 may be bootstrapping before setTimeout
            // But app1 is bootstrapped after setTimeout, expect to load success in this case
            // 先启用，后 flush，测试在 flush 之前应用是 bootstrapping 状态，但是 flush 之后是 bootstrapped 状态的场景
            app1RefFaker.bootstrap();

            // start forkJoin(apps$) in setTimeout
            flush();

            appStatusChangeFaker.expectAppStatus('app1', ApplicationStatus.active);
        }));

        it('should preload app when status is in assetsLoading, assetsLoaded or bootstrapping', fakeAsync(() => {
            [ApplicationStatus.assetsLoading, ApplicationStatus.assetsLoaded, ApplicationStatus.bootstrapping].forEach(
                status => {
                    const preloadAppSpy = jasmine.createSpy('preload app spy');
                    planetApplicationLoader['setAppStatus'](app1, status);
                    const appRefFaker = PlanetApplicationRefFaker.create(app1.name);

                    planetApplicationLoader.preload(app1).subscribe(data => {
                        // expect(NgZone.isInAngularZone()).toEqual(true);
                        preloadAppSpy(data);
                    });

                    expect(preloadAppSpy).not.toHaveBeenCalled();
                    planetApplicationLoader['setAppStatus'](app1, ApplicationStatus.bootstrapped);
                    expect(preloadAppSpy).toHaveBeenCalled();
                    expect(preloadAppSpy).toHaveBeenCalledWith(appRefFaker.planetAppRef);
                    expect(NgZone.isInAngularZone()).toEqual(false);
                }
            );
        }));

        it('should preload app when status is empty or error', fakeAsync(() => {
            const status = sample([ApplicationStatus.loadError, undefined]);
            const loadAppAssets$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
            const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
            assetsLoaderSpy.and.returnValues(loadAppAssets$);

            const appRefFaker = PlanetApplicationRefFaker.create(app1.name);

            const preloadAppSpy = jasmine.createSpy('preload app spy');
            planetApplicationLoader['setAppStatus'](app1, status);
            planetApplicationLoader.preload(app1, true).subscribe(data => {
                // expect(NgZone.isInAngularZone()).toEqual(true);
                preloadAppSpy(data);
            });

            expect(preloadAppSpy).not.toHaveBeenCalled();

            loadAppAssets$.next();
            loadAppAssets$.complete();

            ngZone.run(() => {
                appRefFaker.bootstrap();
            });

            expect(preloadAppSpy).toHaveBeenCalled();
            expect(preloadAppSpy).toHaveBeenCalledWith(appRefFaker.planetAppRef);
            expect(NgZone.isInAngularZone()).toEqual(false);
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
});
