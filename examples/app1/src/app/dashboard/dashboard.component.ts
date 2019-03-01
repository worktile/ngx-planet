import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlanetPortalApplication, GlobalEventDispatcher } from '../../../../../packages/planet/src/public_api';
import { CounterService } from '../counter.service';
import { AppRootContext } from '../../../../../src/app/app-root-context';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    constructor(
        private planetPortal: PlanetPortalApplication,
        private router: Router,
        public counter: CounterService,
        private globalEventDispatcher: GlobalEventDispatcher,
        public appRootContext: AppRootContext
    ) {}

    openADetail() {
        this.globalEventDispatcher.dispatch('openADetail');
    }

    toHostAbout() {
        this.planetPortal.navigateByUrl('/about');
        // this.hostApplication.router.navigateByUrl('/about');
    }

    toAbout() {
        this.router.navigateByUrl('/about');
    }

    changeName(newName: string) {
        // this.planetPortal.run(() => {
        //     this.appRootContext.setName(newName);
        // });
        this.appRootContext.setName(newName);
        this.planetPortal.tick();
    }
}
