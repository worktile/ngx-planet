import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PlanetPortalApplication } from './portal-application';
import { NgZone, ApplicationRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlanetPortalApplication', () => {
    let router: Router;
    let planetPortalApplication: PlanetPortalApplication;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([])]
        });
        router = TestBed.inject(Router);
        planetPortalApplication = new PlanetPortalApplication();
        planetPortalApplication.ngZone = TestBed.inject(NgZone);
        planetPortalApplication.applicationRef = TestBed.inject(ApplicationRef);
        planetPortalApplication.router = TestBed.inject(Router);
    });

    it(`should create PlanetPortalApplication`, () => {
        expect(planetPortalApplication).toBeTruthy();
    });

    it(`should run function`, () => {
        const spy = jasmine.createSpy('spy');
        expect(spy).not.toHaveBeenCalled();
        planetPortalApplication.run(spy);
        expect(spy).toHaveBeenCalled();
    });

    it(`should run function in ngZone`, () => {
        const ngZoneRunSpy = spyOn(planetPortalApplication.ngZone, 'run');
        expect(ngZoneRunSpy).not.toHaveBeenCalled();
        planetPortalApplication.run(() => {});
        expect(ngZoneRunSpy).toHaveBeenCalled();
    });

    it(`should run tick`, () => {
        const tickSpy = spyOn(planetPortalApplication.applicationRef, 'tick');
        expect(tickSpy).not.toHaveBeenCalled();
        planetPortalApplication.tick();
        expect(tickSpy).toHaveBeenCalled();
    });

    it(`should run navigateByUrl`, () => {
        const navigateByUrlSpy = spyOn(planetPortalApplication.router, 'navigateByUrl');
        expect(navigateByUrlSpy).not.toHaveBeenCalled();
        planetPortalApplication.navigateByUrl('/app1/dashboard', { skipLocationChange: true });
        expect(navigateByUrlSpy).toHaveBeenCalled();
        expect(navigateByUrlSpy).toHaveBeenCalledWith('/app1/dashboard', { skipLocationChange: true });
    });
});
