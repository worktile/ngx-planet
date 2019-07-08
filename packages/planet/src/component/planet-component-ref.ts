import { ComponentRef, ElementRef } from '@angular/core';

export class PlanetComponentRef<TData = any> {
    container: HTMLElement;
    componentInstance: TData;
    componentRef: ComponentRef<TData>;
    dispose: () => void;
}
