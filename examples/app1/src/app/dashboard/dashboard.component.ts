import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CounterService } from '../counter.service';
import { AppRootContext } from '@demo/common';
import { PlanetComponentRef, PlanetComponentLoader, PlanetPortalApplication, GlobalEventDispatcher } from 'ngx-planet';
import { ThyDialog } from 'ngx-tethys';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    @ViewChild('container') containerElementRef: ElementRef<HTMLDivElement>;

    private componentRef: PlanetComponentRef;

    constructor(
        private planetPortal: PlanetPortalApplication,
        private router: Router,
        public counter: CounterService,
        private globalEventDispatcher: GlobalEventDispatcher,
        public appRootContext: AppRootContext,
        private dialog: ThyDialog,
        private planetComponentLoader: PlanetComponentLoader
    ) {}

    openADetail() {
        this.globalEventDispatcher.dispatch('openADetail');
    }

    openApp2Component() {
        this.componentRef = this.planetComponentLoader.load('app2', 'project1', {
            container: this.containerElementRef,
            initialState: {}
        });
    }

    disposeApp2Component() {
        this.componentRef.dispose();
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
