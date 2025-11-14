import { Component, HostBinding, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlanetPortalApplication, GlobalEventDispatcher } from '@worktile/planet';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: false
})
export class DashboardComponent {
    private portalApp = inject(PlanetPortalApplication);
    private globalEventDispatcher = inject(GlobalEventDispatcher);

    @HostBinding('class') class = 'thy-layout';

    portalLodashVersion = (0, eval)('window')['lodash'].version;

    app2LodashVersion = window['lodash'].version;

    constructor() {
        // console.log(window);
    }

    toAbout() {
        this.portalApp.navigateByUrl('/about');
    }

    openApp1UserDetail() {
        this.globalEventDispatcher.dispatch('openUserDetail', 1);
    }
}
