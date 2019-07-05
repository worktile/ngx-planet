import { ViewContainerRef } from '@angular/core';

export class PlantComponentConfig<TData = any> {
    container: HTMLElement;
    /**
     * Where the attached component should live in Angular's *logical* component tree.
     * This affects what is available for injection and the change detection order for the
     * component instantiated inside of the dialog. This does not affect where the dialog
     * content will be rendered.
     */
    viewContainerRef?: ViewContainerRef;

    /** Data being injected into the child component. */
    initialState?: TData | null = null;
}
