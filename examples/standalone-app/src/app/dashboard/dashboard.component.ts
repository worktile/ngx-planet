import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRootContext } from '@demo/common';
import { PlanetComponentRef, PlanetComponentLoader, PlanetPortalApplication, GlobalEventDispatcher } from 'ngx-planet';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ThyContent, ThyLayoutDirective } from 'ngx-tethys/layout';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [ThyContent],
    hostDirectives: [ThyLayoutDirective]
})
export class DashboardComponent implements OnInit {
    @ViewChild('container', { static: true }) containerElementRef: ElementRef<HTMLDivElement>;

    private componentRef: PlanetComponentRef;

    constructor(
        private router: Router,
        private globalEventDispatcher: GlobalEventDispatcher
    ) {}

    ngOnInit() {}

    openADetail() {
        this.globalEventDispatcher.dispatch('openADetail');
    }

    openApp1Dialog() {}
}
