import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MicroHostApplication } from '../../../../../packages/micro-core/src/lib/host-application';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    constructor(private hostApplication: MicroHostApplication) {}

    toAbout() {
        this.hostApplication.navigateByUrl('/about');
    }

    openApp1UserDetail() {
        this.hostApplication.globalEventDispatcher.dispatch('openUserDetail', 1);
    }
}
