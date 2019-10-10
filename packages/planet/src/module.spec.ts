import { TestBed } from '@angular/core/testing';
import { NgxPlanetModule } from './module';
import { NgModule } from '@angular/core';
import { PlanetApplicationService } from './application/planet-application.service';
import { Planet } from './planet';
import { RouterModule } from '@angular/router';

const app1 = {
    name: 'app1',
    hostParent: '.host-selector',
    selector: 'app1-root-container',
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
    imports: [NgxPlanetModule, RouterModule.forRoot([])]
})
class AppModule {}

@NgModule({
    imports: [NgxPlanetModule.forRoot([app1]), RouterModule.forRoot([])]
})
class AppModuleWithApps {}

describe('NgxPlanetModule', () => {
    describe('basic', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppModule]
            });
        });

        it('should get NgxPlanetModule', () => {
            expect(TestBed.get(NgxPlanetModule)).toBeTruthy();
        });

        it('should get planet', () => {
            const planet: Planet = TestBed.get(Planet);
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
            expect(TestBed.get(NgxPlanetModule)).toBeTruthy();
        });

        it('should register app1 when use forRoot', () => {
            const planet: Planet = TestBed.get(Planet);
            expect(planet).toBeTruthy();
            expect(planet.getApps()).toEqual([app1]);
        });
    });
});
