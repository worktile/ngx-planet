import { TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { Planet } from './planet';
import { NgxPlanetModule } from './module';
import { RouterModule, Router } from '@angular/router';
import { SwitchModes } from './planet.class';
import { PlanetApplicationService } from './application/planet-application.service';
import { PlanetApplicationLoader } from './application/planet-application-loader';
import { EmptyComponent } from './empty/empty.component';
import { NgZone } from '@angular/core';
import { getApplicationService, getApplicationLoader, clearGlobalPlanet } from './global-planet';

const app1 = {
    name: 'app1',
    hostParent: '.host-selector',
    selector: 'app1-root-container',
    routerPathPrefix: '/app1',
    hostClass: 'app1-host',
    preload: false,
    switchMode: SwitchModes.default,
    resourcePathPrefix: '/static/app1/',
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
    hostParent: '.host-selector',
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

describe('Planet', () => {
    let planet: Planet;
    let planetApplicationService: PlanetApplicationService;
    let planetApplicationLoader: PlanetApplicationLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgxPlanetModule,
                RouterModule.forRoot([
                    {
                        path: '**',
                        component: EmptyComponent
                    }
                ])
            ]
        });
        planet = TestBed.inject(Planet);
        planetApplicationService = getApplicationService();
        planetApplicationLoader = getApplicationLoader();
    });

    afterEach(() => {
        clearGlobalPlanet();
    });

    it('should create planet', () => {
        expect(planet).toBeTruthy();
    });

    it('should register app1', () => {
        const registerSpy = spyOn(planetApplicationService, 'register');
        expect(registerSpy).not.toHaveBeenCalled();
        planet.registerApp(app1);
        expect(registerSpy).toHaveBeenCalled();
        expect(registerSpy).toHaveBeenCalledWith(app1);
    });

    it('should register multiple apps', () => {
        const registerSpy = spyOn(planetApplicationService, 'register');
        expect(registerSpy).not.toHaveBeenCalled();
        planet.registerApps([app1, app2]);
        expect(registerSpy).toHaveBeenCalled();
        expect(registerSpy).toHaveBeenCalledWith([app1, app2]);
    });

    it('should unregister app', () => {
        const unregisterSpy = spyOn(planetApplicationService, 'unregister');
        expect(unregisterSpy).not.toHaveBeenCalled();
        planet.unregisterApp('app1');
        expect(unregisterSpy).toHaveBeenCalled();
        expect(unregisterSpy).toHaveBeenCalledWith('app1');
    });

    it('should get apps', () => {
        const getAppsSpy = spyOn(planetApplicationService, 'getApps');
        getAppsSpy.and.returnValue([app1, app2]);
        expect(getAppsSpy).not.toHaveBeenCalled();
        const apps = planet.getApps();
        expect(getAppsSpy).toHaveBeenCalled();
        expect(apps).toEqual([app1, app2]);
    });

    it('should set options success', () => {
        const setOptionsSpy = spyOn(planetApplicationLoader, 'setOptions');
        expect(setOptionsSpy).not.toHaveBeenCalled();
        const options = {
            switchMode: SwitchModes.coexist,
            errorHandler: () => {}
        };
        planet.setOptions(options);
        expect(setOptionsSpy).toHaveBeenCalled();
        expect(setOptionsSpy).toHaveBeenCalledWith(options);
    });

    it('should reroute when start or navigateByUrl', fakeAsync(() => {
        const router: Router = TestBed.inject(Router);
        const ngZone: NgZone = TestBed.inject(NgZone);
        const rerouteSpy = spyOn(planetApplicationLoader, 'reroute');
        expect(rerouteSpy).not.toHaveBeenCalled();
        planet.start();
        expect(rerouteSpy).toHaveBeenCalledTimes(1);

        ngZone.run(() => {
            router.navigateByUrl('/app1/dashboard');
        });

        tick();

        expect(rerouteSpy).toHaveBeenCalledTimes(2);
        expect(rerouteSpy).toHaveBeenCalledWith({
            url: '/app1/dashboard'
        });

        ngZone.run(() => {
            router.navigateByUrl('/app1/users');
        });
        tick();

        expect(rerouteSpy).toHaveBeenCalledTimes(3);
        expect(rerouteSpy).toHaveBeenCalledWith({
            url: '/app1/users'
        });
    }));
});
