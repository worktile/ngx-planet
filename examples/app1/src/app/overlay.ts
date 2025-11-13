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
import { Location } from '@angular/common';
import { ComponentFactoryResolver, Inject, Injectable, Injector, NgZone, DOCUMENT } from '@angular/core';
import { isArray, concatArray } from 'ngx-tethys/util';

@Injectable({ providedIn: 'root' })
export class AppOverlay extends Overlay {
    create(config?: OverlayConfig): OverlayRef {
        const overlayConfig: OverlayConfig = {
            ...config,
            panelClass: concatArray(config.panelClass, 'app1')
        };
        const overlayRef = super.create(overlayConfig);
        overlayRef.addPanelClass(overlayConfig.panelClass);
        return overlayRef;
    }
}
