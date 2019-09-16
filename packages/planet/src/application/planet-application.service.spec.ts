import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlanetApplicationService } from './planet-application.service';
import { SwitchModes } from '../planet.class';

describe('PlanetApplicationService', () => {
    let planetApplicationService: PlanetApplicationService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: []
        });
        planetApplicationService = TestBed.get(PlanetApplicationService);
    });

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
        manifest: '/static/app/manifest.json',
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
        preload: true,
        switchMode: SwitchModes.coexist,
        resourcePathPrefix: '/static/app2',
        styles: ['styles/main.css'],
        scripts: ['vendor.js', 'main.js'],
        loadSerial: false,
        manifest: '/static/app/manifest.json',
        extra: {
            appName: '应用2'
        }
    };

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
    });

    describe('unregister', () => {
        it('should unregister app1 success', () => {
            planetApplicationService.register(app1);
            expect(planetApplicationService.getApps()).toEqual([app1]);
            planetApplicationService.unregister(app1.name);
            expect(planetApplicationService.getApps()).toEqual([]);
        });
    });

    describe('getAppByMatchedUrl', () => {
        it('should get matched app by url app1/dashboard', () => {
            planetApplicationService.register(app1);
            planetApplicationService.register(app2);
            const app = planetApplicationService.getAppByMatchedUrl('/app1/dashboard');
            expect(app).toBe(app1);
        });

        it('should get matched app which rule is RegExp("(a\\wp3)|app4") by url app3/dashboard', () => {
            planetApplicationService.register(app1);
            planetApplicationService.register(app2);
            const app3 = {
                ...app1,
                name: 'app3',
                routerPathPrefix: new RegExp('(a\\wp3)|app4')
            };
            planetApplicationService.register(app3);
            const app = planetApplicationService.getAppByMatchedUrl('/app3/dashboard');
            expect(app).toBeTruthy('app is not found');
            expect(app).toBe(app3);
        });

        it('should not get matched app by url /__app1/dashboard', () => {
            planetApplicationService.register(app1);
            planetApplicationService.register(app2);
            const app = planetApplicationService.getAppByMatchedUrl('/__app1/dashboard');
            expect(app).toBeFalsy();
        });
    });

    describe('getAppsToPreload', () => {
        it('should get correct preload apps', () => {
            planetApplicationService.register(app1);
            planetApplicationService.register(app2);
            const appsToPreload = planetApplicationService.getAppsToPreload();
            expect(appsToPreload).toEqual([app2]);
        });

        it('should get correct preload apps exclude app names', () => {
            planetApplicationService.register(app1);
            planetApplicationService.register(app2);
            const appsToPreload = planetApplicationService.getAppsToPreload(['app2']);
            expect(appsToPreload).toEqual([]);
        });
    });
});
