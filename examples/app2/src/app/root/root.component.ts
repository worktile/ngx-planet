import { Component, HostBinding, ComponentFactoryResolver, Injector, ApplicationRef, OnInit } from '@angular/core';
@Component({
    selector: 'app2-root-actual',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class AppActualRootComponent {
    @HostBinding(`class.thy-layout`) isThyLayout = true;
    @HostBinding(`class.thy-layout--has-sidebar`) isThyHasSidebarLayout = true;

    constructor() {}
}

@Component({
    selector: 'app2-root',
    template: '<router-outlet></router-outlet>'
})
export class AppRootComponent implements OnInit {
    @HostBinding(`class.thy-layout`) isThyLayout = true;

    constructor() {}

    ngOnInit() {}
}
