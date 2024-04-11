/*
 * Public API Surface of core
 */

export * from './application/planet-application-loader';
export { PlanetApplicationRef } from './application/planet-application-ref';
export { PlanetApplicationService } from './application/planet-application.service';
export * from './application/portal-application';
export * from './assets-loader';
export { PlanetComponent, PlanetComponentLoader } from './component/planet-component-loader';
export { PlanetComponentOutlet } from './component/planet-component-outlet';
export { PlanetComponentRef } from './component/planet-component-types';
export { PlantComponentConfig } from './component/plant-component.config';
export * from './empty/empty.component';
export * from './global-event-dispatcher';
export { defineApplication, getPlanetApplicationRef, getPortalApplicationData } from './global-planet';
export * from './module';
export * from './planet';
export * from './planet.class';
export * from './router/route-redirect';
