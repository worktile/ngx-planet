import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlanetOverlayContainer extends OverlayContainer {
    constructor(@Inject(DOCUMENT) document: any, protected _platform: Platform) {
        super(document, _platform);
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
