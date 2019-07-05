import { ComponentRef } from '@angular/core';

export class PlantComponentRef<TData = any> {
    container: HTMLElement;
    componentInstance: TData;
    componentRef: ComponentRef<TData>;
}
