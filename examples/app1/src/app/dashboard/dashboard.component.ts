import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MicroHostApplication, GlobalEventDispatcher } from '../../../../../packages/micro-core/src/public_api';
import { CounterService } from '../counter.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    constructor(
        private hostApplication: MicroHostApplication,
        private router: Router,
        public counter: CounterService,
        private globalEventDispatcher: GlobalEventDispatcher
    ) {}

    openADetail() {
        this.globalEventDispatcher.dispatch({
            name: 'openADetail',
            payload: null
        });
    }

    toHostAbout() {
        this.hostApplication.navigateByUrl('/about');
        // this.hostApplication.router.navigateByUrl('/about');
    }

    toAbout() {
        this.router.navigateByUrl('/about');
    }
}
