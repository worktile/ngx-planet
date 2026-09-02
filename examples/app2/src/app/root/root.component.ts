import { PlanetComponentLoader, routeRedirect } from '@worktile/planet';
import { Component, HostBinding, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ProjectListComponent } from '../projects/project-list.component';

@Component({
    selector: 'app2-root-actual',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
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
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppRootComponent implements OnInit {
    private planetComponentLoader = inject(PlanetComponentLoader);

    @HostBinding(`class.thy-layout`) isThyLayout = true;

    constructor() {}

    ngOnInit() {
        this.planetComponentLoader.register(ProjectListComponent);
    }
}
