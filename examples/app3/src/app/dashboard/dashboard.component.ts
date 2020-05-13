import { Component, HostBinding } from '@angular/core';
import { PlanetPortalApplication, GlobalEventDispatcher } from 'ngx-planet';

@Component({
    selector: 'app3-dashboard',
    templateUrl: './dashboard.component.html'
})
export class AppDashboardComponent {
    @HostBinding('class') class = 'thy-layout';

    constructor(private portalApp: PlanetPortalApplication, private globalEventDispatcher: GlobalEventDispatcher) {}

    toAbout() {
        this.portalApp.navigateByUrl('/about');
    }
}
