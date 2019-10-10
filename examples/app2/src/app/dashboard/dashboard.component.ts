import { Component, Inject, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { PlanetPortalApplication, GlobalEventDispatcher } from 'ngx-planet';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    @HostBinding('class') class = 'thy-layout';

    constructor(private portalApp: PlanetPortalApplication, private globalEventDispatcher: GlobalEventDispatcher) {}

    toAbout() {
        this.portalApp.navigateByUrl('/about');
    }

    openApp1UserDetail() {
        this.globalEventDispatcher.dispatch('openUserDetail', 1);
    }
}
