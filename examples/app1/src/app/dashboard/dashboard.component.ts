import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CounterService } from '../counter.service';
import { AppRootContext } from '@demo/common';
import { PlanetComponentRef, PlanetComponentLoader, PlanetPortalApplication, GlobalEventDispatcher } from 'ngx-planet';
import { ThyDialog, ThyDialogSizes } from 'ngx-tethys/dialog';
import { App1DetailComponent } from '../detail/detail.component';
import { ProjectsDialogComponent } from '../projects/dialog/projects-dialog.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    @ViewChild('container', { static: true }) containerElementRef: ElementRef<HTMLDivElement>;

    public size: ThyDialogSizes = ThyDialogSizes.md;

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

    openApp1Dialog() {
        this.dialog.open(App1DetailComponent, {
            size: this.size
        });
    }

    openApp2Dialog() {
        this.dialog.open(ProjectsDialogComponent, {
            size: ThyDialogSizes.supperLg
        });
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
