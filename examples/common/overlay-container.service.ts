import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlanetOverlayContainer extends OverlayContainer {
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
