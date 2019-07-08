import { ViewContainerRef, ElementRef } from '@angular/core';

export class PlantComponentConfig<TData = any> {
    container: HTMLElement | ElementRef<HTMLElement | any>;
    /** Data being injected into the child component. */
    initialState?: TData | null = null;
}
