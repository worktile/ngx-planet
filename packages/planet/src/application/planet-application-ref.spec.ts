import { defineApplication, getPlanetApplicationRef } from './planet-application-ref';
import { PlanetPortalApplication } from './portal-application';
describe('PlanetApplicationRef', () => {
    afterEach(() => {
        // delete all apps
        Object.keys(window['planet'].apps).forEach(appName => {
            delete window['planet'].apps[appName];
        });
    });

    describe('defineApplication', () => {
        it('should define application success', () => {
            defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                return new Promise(() => {});
            });
            expect(window['planet'].apps['app1']).toBeTruthy();
        });

        it('should throw error when define application has exist', () => {
            defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                return new Promise(() => {});
            });
            expect(() => {
                defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                    return new Promise(() => {});
                });
            }).toThrowError('app1 application has exist.');
        });
    });

    describe('getPlanetApplicationRef', () => {
        it('should get planet application ref success', () => {
            defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                return new Promise(() => {});
            });
            const planetAppRef = getPlanetApplicationRef('app1');
            expect(planetAppRef).toBeTruthy();
            expect(planetAppRef).toBe(window['planet'].apps['app1']);
        });

        it('should not get planet appRef which has not exist', () => {
            defineApplication('app1', (portalApp?: PlanetPortalApplication) => {
                return new Promise(() => {});
            });
            const planetAppRef = getPlanetApplicationRef('app2');
            expect(planetAppRef).toBeFalsy();
        });
    });
});
