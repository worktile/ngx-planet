import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CounterService } from '../counter.service';
import { AppRootContext } from '@demo/common';
import { PlanetComponentRef, PlanetComponentLoader, PlanetPortalApplication, GlobalEventDispatcher } from 'ngx-planet';
import { ThyDialog } from 'ngx-tethys';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    @ViewChild('container', { static: true }) containerElementRef: ElementRef<HTMLDivElement>;

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

    ngOnInit() {}

    openADetail() {
        this.globalEventDispatcher.dispatch('openADetail');
    }

    openApp2Component() {
        this.planetComponentLoader
            .load('app2', 'project1', {
                container: this.containerElementRef,
                initialState: {}
            })
            .subscribe(componentRef => {
                this.componentRef = componentRef;
            });
    }

    disposeApp2Component() {
        if (this.componentRef) {
            this.componentRef.dispose();
        }
    }

    changeName(newName: string) {
        this.appRootContext.setName(newName);
        this.planetPortal.tick();
    }
}
