import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { concatArray } from 'ngx-tethys/util';

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
