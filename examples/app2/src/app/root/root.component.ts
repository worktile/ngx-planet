import { PlanetComponentLoader, routeRedirect } from '@worktile/planet';
import { Component, HostBinding, OnInit } from '@angular/core';
import { ProjectListComponent } from '../projects/project-list.component';

@Component({
    selector: 'app2-root-actual',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss'],
    standalone: false
})
export class AppActualRootComponent {
    @HostBinding(`class.thy-layout`) isThyLayout = true;
    @HostBinding(`class.thy-layout--has-sidebar`) isThyHasSidebarLayout = true;

    constructor() {}
}

@Component({
    selector: 'app2-root',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class AppRootComponent implements OnInit {
    @HostBinding(`class.thy-layout`) isThyLayout = true;

    constructor(private planetComponentLoader: PlanetComponentLoader) {}

    ngOnInit() {
        this.planetComponentLoader.register(ProjectListComponent);
    }
}
