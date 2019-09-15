import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlanetApplicationLoader, ApplicationStatus } from './planet-application-loader';
import { AssetsLoader } from '../assets-loader';

import { SwitchModes } from '../planet.class';
import { PlanetApplicationService } from './planet-application.service';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { PlanetApplicationRef } from './planet-application-ref';

const app1 = {
    name: 'app1',
    host: '.host-selector',
    selector: 'app1-root-container',
    routerPathPrefix: '/app1',
    hostClass: 'app1-host',
    preload: false,
    switchMode: SwitchModes.coexist,
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

function mockApplicationRef(appName: string) {
    const planetAppRef = new PlanetApplicationRef(appName, null);
    (window as any).planet.apps[appName] = planetAppRef;
    return planetAppRef;
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
    });

    afterEach(() => {
        (window as any).planet.apps = {};
    });

    it(`should load and bootstrap app`, fakeAsync(() => {
        const loadAppAssets$ = new Subject();
        const assetsLoaderSpy = spyOn(assetsLoader, 'loadAppAssets');
        assetsLoaderSpy.and.returnValue(loadAppAssets$);

        const planetAppRef = mockApplicationRef(app1.name);
        const bootstrapSpy = spyOn(planetAppRef, 'bootstrap');

        const appStatusChangeSpy = jasmine.createSpy('app status change spy');
        planetApplicationLoader.appStatusChange.subscribe(appStatusChangeSpy);
        expect(appStatusChangeSpy).not.toHaveBeenCalled();

        planetApplicationLoader.reroute({ url: '/app1/dashboard' });

        expect(appStatusChangeSpy).toHaveBeenCalled();
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoading });

        loadAppAssets$.next();
        loadAppAssets$.complete();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(2);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.assetsLoaded });

        expect(bootstrapSpy).not.toHaveBeenCalled();
        ngZone.onStable.next();
        expect(bootstrapSpy).toHaveBeenCalled();

        expect(appStatusChangeSpy).toHaveBeenCalledTimes(4);
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app1, status: ApplicationStatus.bootstrapped });

        tick();
    }));

    it(`should cancel load app1 which not returned and start load app2`, fakeAsync(() => {
        const loadApp1Assets$ = new Subject();
        const loadApp2Assets$ = new Subject();

        const planetApp1Ref = mockApplicationRef(app1.name);
        const app1BootstrapSpy = spyOn(planetApp1Ref, 'bootstrap');

        const planetApp2Ref = mockApplicationRef(app2.name);
        const app2BootstrapSpy = spyOn(planetApp2Ref, 'bootstrap');

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
        expect(appStatusChangeSpy).toHaveBeenCalledWith({ app: app2, status: ApplicationStatus.bootstrapped });

        tick();
    }));
});
