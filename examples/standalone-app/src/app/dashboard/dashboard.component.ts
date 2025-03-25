import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppRootContext } from '@demo/common';
import { PlanetComponentRef, PlanetComponentLoader, PlanetPortalApplication, GlobalEventDispatcher } from '@worktile/planet';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ThyContent, ThyLayoutDirective } from 'ngx-tethys/layout';
import { DemoCommonModule } from '../../../../common/module';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    hostDirectives: [ThyLayoutDirective],
    imports: [ThyContent, DemoCommonModule, RouterLink]
})
export class DashboardComponent implements OnInit {
    @ViewChild('container', { static: true }) containerElementRef: ElementRef<HTMLDivElement>;

    private componentRef: PlanetComponentRef;

    constructor(
        private router: Router,
        private portalApp: PlanetPortalApplication,
        private globalEventDispatcher: GlobalEventDispatcher
    ) {}

    ngOnInit() {}

    toAbout() {
        this.portalApp.navigateByUrl('/about');
    }

    openADetail() {
        this.globalEventDispatcher.dispatch('openADetail');
    }

    openApp1Dialog() {}
}
