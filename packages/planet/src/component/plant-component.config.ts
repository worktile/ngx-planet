import { ViewContainerRef, ElementRef } from '@angular/core';

export class PlantComponentConfig<TData = any> {
    /** Load target container */
    container: HTMLElement | ElementRef<HTMLElement | any>;
    /** Component wrapper class. */
    wrapperClass?: string;
    /** Data being injected into the child component. */
    initialState?: TData | null = null;
}
