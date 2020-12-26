import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { Provider } from '@angular/core';
import { PlanetOverlayContainer } from './overlay-container.service';

export * from './app-root-context';
export * from './module';
export * from './cache';
export * from './overlay-container.service';

export const OVERLAY_PROVIDER: Provider = {
    provide: OverlayContainer,
    useClass: PlanetOverlayContainer
};
