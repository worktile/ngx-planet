import { Component, Inject, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { PlanetPortalApplication, GlobalEventDispatcher } from 'ngx-planet';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    @HostBinding('class') class = 'thy-layout';

    portalLodashVersion = (0, eval)('window')['lodash'].version;

    app2LodashVersion = window['lodash'].version;

    constructor(private portalApp: PlanetPortalApplication, private globalEventDispatcher: GlobalEventDispatcher) {
        console.log(window);
    }

    toAbout() {
        this.portalApp.navigateByUrl('/about');
    }

    openApp1UserDetail() {
        this.globalEventDispatcher.dispatch('openUserDetail', 1);
    }
}
