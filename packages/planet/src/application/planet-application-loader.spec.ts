import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlanetApplicationLoader, ApplicationStatus } from './planet-application-loader';
import { AssetsLoader } from '../assets-loader';

import { SwitchModes } from '../planet.class';
import { PlanetApplicationService } from './planet-application.service';
import { NgZone } from '@angular/core';
import { PlanetApplicationRef } from './planet-application-ref';

const app1 = {
    name: 'app1',
    host: '.host-selector',
    selector: 'app1-root-container',
    routerPathPrefix: '/app1',
    hostClass: 'app1-host',
    preload: false,
    switchMode: SwitchModes.default,
    resourcePathPrefix: '/static/app1',
    styles: ['styles/main.css'],
    scripts: ['vendor.js', 'main.js'],
    loadSerial: false,
    manifest: '',
    extra: {
        appName: '应用1'
    }
};

const app2 = {
    name: 'app2',
    host: '.host-selector',
    selector: 'app2-root-container',
    routerPathPrefix: '/app2',
    hostClass: 'app2-host',
    preload: false,
    switchMode: SwitchModes.coexist,
    resourcePathPrefix: '/static/app2',
    styles: ['styles/main.css'],
    scripts: ['vendor.js', 'main.js'],
    loadSerial: false,
    extra: {
        appName: '应用2'
    }
};

function spyPlanetApplicationRef(appName: string) {
    const planetAppRef = new PlanetApplicationRef(appName, null);
    (window as any).planet.apps[appName] = planetAppRef;
    const appRefBootstrapSpy = spyOn(planetAppRef, 'bootstrap');
    const appRefDestroySpy = spyOn(planetAppRef, 'destroy');
    return [appRefBootstrapSpy, appRefDestroySpy, planetAppRef];
}

describe('PlanetApplicationLoader', () => {
    let planetApplicationLoader: PlanetApplicationLoader;
    let planetApplicationService: PlanetApplicationService;
    let assetsLoader: AssetsLoader;
    let ngZone: NgZone;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterModule.forRoot([])]
        });
        planetApplicationLoader = TestBed.get(PlanetApplicationLoader);
        planetApplicationService = TestBed.get(PlanetApplicationService);
        assetsLoader = TestBed.get(AssetsLoader);
        ngZone = TestBed.get(NgZone);

        planetApplicationService.register(app1);
        planetApplicationService.register(app2);

        // 创建宿主容器
        const hostContainer = document.createElement('DIV');
        hostContainer.classList.add('host-selector');
        document.body.appendChild(hostContainer);
    });

    afterEach(() => {
        (window as any).planet.apps = {};
    });

    it(`should load (load assets and bootstrap) app1 success`, fakeAsync(() => {
        const loadAppAssets$ = new Subject();
        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValue(loadAppAssets$);

        const [bootstrapSpy] = spyPlanetApplicationRef(app1.name);

        const appStatusChangeSpy = jasmine.createSpy('app status change spy');
        planetApplicationLoader.appStatusChange.subscribe(appStatusChangeSpy);
        expect(appStatusChangeSpy).not.toHaveBeenCalled();

        planetApplicationLoader.reroute({ url: '/app1/dashboard' });

        expect(appStatusChangeSpy).toHaveBeenCalled();
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });
        expect(planetApplicationLoader.loadingDone).toBe(false);

        loadAppAssets$.next();
        loadAppAssets$.complete();

        expect(planetApplicationLoader.loadingDone).toBe(true);
        expect(appStatusChangeSpy).toHaveBeenCalledTimes(2);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoaded });

        expect(bootstrapSpy).not.toHaveBeenCalled();

        ngZone.onStable.next();
        expect(bootstrapSpy).toHaveBeenCalled();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(4);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.bootstrapping });
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.bootstrapped });

        // 判断是否在宿主元素中创建了应用根节点
        expectApp1Element();
        tick();
    }));

    it(`should cancel load app1 which assets has not loaded when next route (app2) change`, fakeAsync(() => {
        const loadApp1Assets$ = new Subject();
        const loadApp2Assets$ = new Subject();

        const [app1BootstrapSpy] = spyPlanetApplicationRef(app1.name);
        const [app2BootstrapSpy] = spyPlanetApplicationRef(app2.name);

        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp2Assets$);

        const appStatusChangeSpy = jasmine.createSpy('app status change spy');
        planetApplicationLoader.appStatusChange.subscribe(appStatusChangeSpy);

        expect(appStatusChangeSpy).not.toHaveBeenCalled();
        planetApplicationLoader.reroute({ url: '/app1' });
        expect(appStatusChangeSpy).toHaveBeenCalled();
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

        planetApplicationLoader.reroute({ url: '/app2' });
        expect(appStatusChangeSpy).toHaveBeenCalledTimes(2);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.assetsLoading });
        loadApp1Assets$.next();
        loadApp1Assets$.complete();
        expect(appStatusChangeSpy).toHaveBeenCalledTimes(2);
        loadApp2Assets$.next();
        loadApp2Assets$.complete();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(3);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.assetsLoaded });

        ngZone.onStable.next();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(5);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.bootstrapping });
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.bootstrapped });

        expect(app1BootstrapSpy).not.toHaveBeenCalled();
        expect(app2BootstrapSpy).toHaveBeenCalled();

        tick();
    }));

    it(`should cancel load app1 which has not bootstrapped when next route (app2) change`, fakeAsync(() => {
        const loadApp1Assets$ = new Subject();
        const loadApp2Assets$ = new Subject();

        const [app1BootstrapSpy] = spyPlanetApplicationRef(app1.name);
        const [app2BootstrapSpy] = spyPlanetApplicationRef(app2.name);

        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp2Assets$);

        const appStatusChangeSpy = jasmine.createSpy('app status change spy');
        planetApplicationLoader.appStatusChange.subscribe(appStatusChangeSpy);

        expect(appStatusChangeSpy).not.toHaveBeenCalled();
        planetApplicationLoader.reroute({ url: '/app1' });
        expect(appStatusChangeSpy).toHaveBeenCalled();
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

        loadApp1Assets$.next();
        loadApp1Assets$.complete();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(2);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoaded });

        planetApplicationLoader.reroute({ url: '/app2' });
        expect(appStatusChangeSpy).toHaveBeenCalledTimes(3);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.assetsLoading });

        loadApp2Assets$.next();
        loadApp2Assets$.complete();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(4);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.assetsLoaded });

        ngZone.onStable.next();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(6);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.bootstrapping });
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.bootstrapped });

        expect(app1BootstrapSpy).not.toHaveBeenCalled();
        expect(app2BootstrapSpy).toHaveBeenCalled();

        tick();
    }));

    it(`should load next app(app2) when last app(app1) load error`, fakeAsync(() => {
        const loadApp1Assets$ = new Subject();
        const loadApp2Assets$ = new Subject();

        const errorHandlerSpy = jasmine.createSpy(`error handler spy`);
        planetApplicationLoader.setOptions({
            errorHandler: errorHandlerSpy
        });

        const [app1BootstrapSpy] = spyPlanetApplicationRef(app1.name);
        const [app2BootstrapSpy] = spyPlanetApplicationRef(app2.name);

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

        ngZone.onStable.next();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(6);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.bootstrapping });
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.bootstrapped });

        expect(app1BootstrapSpy).not.toHaveBeenCalled();
        expect(app2BootstrapSpy).toHaveBeenCalled();

        // 判断是否在宿主元素中创建了应用根节点
        expectApp2Element();
        tick();
    }));

    it(`should reload app(app1) when before app(app1) load error`, fakeAsync(() => {
        const loadApp1Assets$ = new Subject();
        const loadApp1AginAssets$ = new Subject();

        const errorHandlerSpy = jasmine.createSpy(`error handler spy`);
        planetApplicationLoader.setOptions({
            errorHandler: errorHandlerSpy
        });

        const [app1BootstrapSpy] = spyPlanetApplicationRef(app1.name);

        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp1AginAssets$);

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

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(2);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.loadError });

        planetApplicationLoader.reroute({ url: '/app1' });
        expect(appStatusChangeSpy).toHaveBeenCalledTimes(3);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

        loadApp1AginAssets$.next();
        loadApp1AginAssets$.complete();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(4);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoaded });

        ngZone.onStable.next();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(6);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.bootstrapping });
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.bootstrapped });

        expect(app1BootstrapSpy).toHaveBeenCalled();

        // 判断是否在宿主元素中创建了应用根节点
        expectApp1Element();

        tick();
    }));

    describe('preload', () => {
        it(`should preload load app3 when after loaded app1`, fakeAsync(() => {
            const newApp2 = {
                ...app2,
                preload: true
            };

            planetApplicationService.unregister(app2.name);
            planetApplicationService.register(newApp2);

            const loadApp1Assets$ = new Subject();
            const loadApp2Assets$ = new Subject();

            const [app1BootstrapSpy] = spyPlanetApplicationRef(app1.name);
            const [app2BootstrapSpy] = spyPlanetApplicationRef(app2.name);

            const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
            assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp2Assets$);

            const appStatusChangeSpy = jasmine.createSpy('app status change spy');
            planetApplicationLoader.appStatusChange.subscribe(appStatusChangeSpy);

            expect(appStatusChangeSpy).not.toHaveBeenCalled();
            planetApplicationLoader.reroute({ url: '/app1' });
            expect(appStatusChangeSpy).toHaveBeenCalled();
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

            loadApp1Assets$.next();
            loadApp1Assets$.complete();

            expect(appStatusChangeSpy).toHaveBeenCalledTimes(2);
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoaded });

            ngZone.onStable.next();

            expect(appStatusChangeSpy).toHaveBeenCalledTimes(4);
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.bootstrapping });
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.bootstrapped });

            expect(app1BootstrapSpy).toHaveBeenCalled();

            tick(300);
            expect(app2BootstrapSpy).not.toHaveBeenCalled();

            // 已经开始加载 App2 静态资源
            expect(appStatusChangeSpy).toHaveBeenCalledTimes(5);
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: newApp2, status: ApplicationStatus.assetsLoading });

            // App2 静态资源加载完毕
            loadApp2Assets$.next();
            loadApp2Assets$.complete();

            expect(appStatusChangeSpy).toHaveBeenCalledTimes(6);
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: newApp2, status: ApplicationStatus.assetsLoaded });

            // onStable 开始启动应用
            ngZone.onStable.next();
            expect(appStatusChangeSpy).toHaveBeenCalledTimes(8);
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: newApp2, status: ApplicationStatus.bootstrapping });
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: newApp2, status: ApplicationStatus.bootstrapped });
            expect(app2BootstrapSpy).toHaveBeenCalled();
        }));

        it(`should throw error when preload load app3 error`, fakeAsync(() => {
            const newApp2 = {
                ...app2,
                preload: true
            };

            planetApplicationService.unregister(app2.name);
            planetApplicationService.register(newApp2);

            const loadApp1Assets$ = new Subject();
            const loadApp2Assets$ = new Subject();

            const errorHandlerSpy = jasmine.createSpy(`error handler spy`);
            planetApplicationLoader.setOptions({
                errorHandler: errorHandlerSpy
            });

            const [app1BootstrapSpy] = spyPlanetApplicationRef(app1.name);
            const [app2BootstrapSpy] = spyPlanetApplicationRef(app2.name);

            const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
            assetsLoaderSpy.and.returnValues(loadApp1Assets$, loadApp2Assets$);

            const appStatusChangeSpy = jasmine.createSpy('app status change spy');
            planetApplicationLoader.appStatusChange.subscribe(appStatusChangeSpy);

            expect(appStatusChangeSpy).not.toHaveBeenCalled();
            planetApplicationLoader.reroute({ url: '/app1' });
            expect(appStatusChangeSpy).toHaveBeenCalled();
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

            loadApp1Assets$.next();
            loadApp1Assets$.complete();

            expect(appStatusChangeSpy).toHaveBeenCalledTimes(2);
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoaded });

            ngZone.onStable.next();

            expect(appStatusChangeSpy).toHaveBeenCalledTimes(4);
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.bootstrapping });
            expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.bootstrapped });

            expect(app1BootstrapSpy).toHaveBeenCalled();

            tick(300);
            expect(app2BootstrapSpy).not.toHaveBeenCalled();

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
