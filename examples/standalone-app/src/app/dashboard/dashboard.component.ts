import { Component, ViewChild, ElementRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlanetPortalApplication, GlobalEventDispatcher } from '@worktile/planet';
import { ThyContent, ThyLayoutDirective } from 'ngx-tethys/layout';
import { DemoCommonModule } from '../../../../common/module';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    hostDirectives: [ThyLayoutDirective],
    imports: [ThyContent, DemoCommonModule, RouterLink]
})
export class DashboardComponent implements OnInit {
    private portalApp = inject(PlanetPortalApplication);
    private globalEventDispatcher = inject(GlobalEventDispatcher);

    @ViewChild('container', { static: true }) containerElementRef: ElementRef<HTMLDivElement>;

    constructor() {}

    ngOnInit() {}

    toAbout() {
        this.portalApp.navigateByUrl('/about');
    }

    openADetail() {
        this.globalEventDispatcher.dispatch('openADetail');
    }

    openApp1Dialog() {}
}
