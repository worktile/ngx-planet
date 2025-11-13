import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';

import { Injectable, DOCUMENT, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlanetOverlayContainer extends OverlayContainer {
    protected _platform: Platform;

    constructor() {
        const document = inject(DOCUMENT);
        const _platform = inject(Platform);

        super(document, _platform);

        this._platform = _platform;
    }

    private _getContainerElement(): HTMLElement {
        if (!this._containerElement) {
            this._containerElement = this._document.querySelector('.cdk-overlay-container');
            return this._containerElement;
        } else {
            return this._containerElement;
        }
    }

    getContainerElement(): HTMLElement {
        if (!this._getContainerElement()) {
            this._createContainer();
        }

        return this._containerElement;
    }
}
