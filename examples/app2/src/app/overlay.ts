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
import { helpers } from 'ngx-tethys';

@Injectable()
export class AppOverlay extends Overlay {
    constructor(
        /** Scrolling strategies that can be used when creating an overlay. */
        scrollStrategies: ScrollStrategyOptions,
        _overlayContainer: OverlayContainer,
        _componentFactoryResolver: ComponentFactoryResolver,
        _positionBuilder: OverlayPositionBuilder,
        _keyboardDispatcher: OverlayKeyboardDispatcher,
        _injector: Injector,
        _ngZone: NgZone,
        @Inject(DOCUMENT) _document: any,
        _directionality: Directionality,
        _location: Location
    ) {
        super(
            scrollStrategies,
            _overlayContainer,
            _componentFactoryResolver,
            _positionBuilder,
            _keyboardDispatcher,
            _injector,
            _ngZone,
            _document,
            _directionality,
            _location
        );
    }

    private getOverlayPanelClasses(config: OverlayConfig) {
        let classes = ['app2'];
        if (config.panelClass) {
            if (helpers.isArray(config.panelClass)) {
                classes = classes.concat(config.panelClass);
            } else {
                classes.push(config.panelClass as string);
            }
        }
        return classes;
    }

    create(config?: OverlayConfig): OverlayRef {
        const overlayConfig: OverlayConfig = {
            ...config,
            panelClass: this.getOverlayPanelClasses(config)
        };
        const overlayRef = super.create(overlayConfig);
        overlayRef.addPanelClass(overlayConfig.panelClass);
        return overlayRef;
    }
}
