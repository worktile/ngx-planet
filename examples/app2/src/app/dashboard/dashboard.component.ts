import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlanetPortalApplication } from '../../../../../packages/planet/src/public_api';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    constructor(private portalApp: PlanetPortalApplication) {}

    toAbout() {
        this.portalApp.navigateByUrl('/about');
    }

    openApp1UserDetail() {
        this.portalApp.globalEventDispatcher.dispatch('openUserDetail', 1);
    }
}
