import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MicroHostApplication, GlobalEventDispatcher } from '../../../../../packages/micro-core/src/public_api';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    constructor(
        private hostApplication: MicroHostApplication,
        private router: Router,
        private globalEventDispatcher: GlobalEventDispatcher
    ) {}

    openADetail() {
        this.globalEventDispatcher.dispatch({
            name: 'openADetail',
            payload: null
        });
    }

    toAbout() {
        // this.router.dispose();
        this.hostApplication.navigateByUrl('/about');
        // this.hostApplication.router.navigateByUrl('/about');
    }
}
