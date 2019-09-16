import { Component, HostBinding, ComponentFactoryResolver, Injector, ApplicationRef } from '@angular/core';
@Component({
    selector: 'app2-root-container',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class AppRootComponent {
    @HostBinding(`class.thy-layout`) isThyLayout = true;
    @HostBinding(`class.thy-layout--has-sidebar`) isThyHasSidebarLayout = true;

    constructor() {}
}
