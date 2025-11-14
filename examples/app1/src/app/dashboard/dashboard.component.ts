import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CounterService } from '../counter.service';
import { AppRootContext } from '@demo/common';
import { PlanetComponentRef, PlanetComponentLoader, PlanetPortalApplication, GlobalEventDispatcher } from '@worktile/planet';
import { ThyDialog, ThyDialogSizes } from 'ngx-tethys/dialog';
import { App1DetailComponent } from '../detail/detail.component';
import { ProjectsDialogComponent } from '../projects/dialog/projects-dialog.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: false
})
export class DashboardComponent {
    private planetPortal = inject(PlanetPortalApplication);
    counter = inject(CounterService);
    private globalEventDispatcher = inject(GlobalEventDispatcher);
    appRootContext = inject(AppRootContext);
    private dialog = inject(ThyDialog);
    private planetComponentLoader = inject(PlanetComponentLoader);

    @ViewChild('container', { static: true }) containerElementRef: ElementRef<HTMLDivElement>;

    public size: ThyDialogSizes = ThyDialogSizes.md;

    private componentRef: PlanetComponentRef;

    constructor() {}

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
            size: ThyDialogSizes.superLg
        });
    }

    openApp2Component() {
        this.planetComponentLoader
            .load('app2', 'app-project-list', {
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
