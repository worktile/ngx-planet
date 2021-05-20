import { Directionality } from '@angular/cdk/bidi';
import {
    Overlay,
    OverlayConfig,
    OverlayContainer,
    OverlayKeyboardDispatcher,
    OverlayPositionBuilder,
    OverlayRef,
    ScrollStrategyOptions
} from '@angular/cdk/overlay';
import { DOCUMENT, Location } from '@angular/common';
import { ComponentFactoryResolver, Inject, Injectable, Injector, NgZone } from '@angular/core';
import { isArray, concatArray } from 'ngx-tethys/util';

@Injectable({ providedIn: 'root' })
export class AppOverlay extends Overlay {
    create(config?: OverlayConfig): OverlayRef {
        const overlayConfig: OverlayConfig = {
            ...config,
            panelClass: concatArray(config.panelClass, 'app2')
        };
        const overlayRef = super.create(overlayConfig);
        overlayRef.addPanelClass(overlayConfig.panelClass);
        return overlayRef;
    }
}
