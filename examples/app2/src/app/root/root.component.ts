import { Component, HostBinding, ComponentFactoryResolver, Injector, ApplicationRef } from '@angular/core';
import { GlobalEventDispatcher } from '../../../../../packages/planet/src/public_api';
import { DomPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { ProjectListComponent } from '../projects/project-list.component';

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
