import { TestBed } from '@angular/core/testing';
import { NgxPlanetModule } from './module';
import { NgModule } from '@angular/core';
import { Planet } from './planet';
import { clearGlobalPlanet } from './global-planet';
import { PlanetApplicationService } from './application/planet-application.service';
import { RouterTestingModule } from '@angular/router/testing';

const app1 = {
    name: 'app1',
    hostParent: '.host-selector',
    selector: 'app1-root',
    routerPathPrefix: '/app1',
    hostClass: 'app1-host',
    preload: false,
    resourcePathPrefix: '/static/app1/',
    styles: ['styles/main.css'],
    scripts: ['vendor.js', 'main.js'],
    loadSerial: false,
    manifest: '',
    extra: {
        appName: '应用1'
    }
};

@NgModule({
    imports: [NgxPlanetModule, RouterTestingModule.withRoutes([])]
})
class AppModule {}

@NgModule({
    imports: [NgxPlanetModule.forRoot([app1]), RouterTestingModule.withRoutes([])]
})
class AppModuleWithApps {}

describe('NgxPlanetModule', () => {
    afterEach(() => {
        clearGlobalPlanet();
        const applicationService = TestBed.inject(PlanetApplicationService);
        applicationService['apps'] = [];
        applicationService['appsMap'] = {};
    });

    describe('basic', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppModule]
            });
        });

        it('should get NgxPlanetModule', () => {
            expect(TestBed.inject(NgxPlanetModule)).toBeTruthy();
        });

        it('should get planet', () => {
            const planet: Planet = TestBed.inject(Planet);
            expect(planet).toBeTruthy();
            expect(planet.getApps()).toEqual([]);
        });
    });

    describe('forRoot', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppModuleWithApps]
            });
        });

        it('should get NgxPlanetModule', () => {
            expect(TestBed.inject(NgxPlanetModule)).toBeTruthy();
        });

        it('should register app1 when use forRoot', () => {
            const planet: Planet = TestBed.inject(Planet);
            expect(planet).toBeTruthy();
            expect(planet.getApps()).toEqual([app1]);
        });
    });
});
