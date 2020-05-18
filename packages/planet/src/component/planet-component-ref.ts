import { ComponentRef, ElementRef } from '@angular/core';

export class PlanetComponentRef<TData = any> {
    wrapperElement: HTMLElement;
    componentInstance: TData;
    componentRef: ComponentRef<TData>;
    dispose: () => void;
}
