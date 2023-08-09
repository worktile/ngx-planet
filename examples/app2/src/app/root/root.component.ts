import { PlanetComponentLoader, routeRedirect } from 'ngx-planet';
import { Component, HostBinding, OnInit } from '@angular/core';
import { ProjectListComponent } from '../projects/project-list.component';

@Component({
    selector: 'app2-root-actual',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class AppActualRootComponent {
    @HostBinding(`class.thy-layout`) isThyLayout = true;
    @HostBinding(`class.thy-layout--has-sidebar`) isThyHasSidebarLayout = true;

    routeRedirect = routeRedirect('dashboard');

    constructor() {}
}

@Component({
    selector: 'app2-root',
    template: '<router-outlet></router-outlet>'
})
export class AppRootComponent implements OnInit {
    @HostBinding(`class.thy-layout`) isThyLayout = true;

    constructor(private planetComponentLoader: PlanetComponentLoader) {}

    ngOnInit() {
        this.planetComponentLoader.register(ProjectListComponent);
    }
}
