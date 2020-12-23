import { ComponentRef, ElementRef } from '@angular/core';

export class PlanetComponentRef<TComp = any> {
    wrapperElement: HTMLElement;
    componentInstance: TComp;
    componentRef: ComponentRef<TComp>;
    dispose: () => void;
}
