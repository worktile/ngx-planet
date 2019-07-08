import { Component, EventEmitter, OnInit, DoCheck, ApplicationRef } from '@angular/core';
import { GlobalEventDispatcher, PlanetComponentRef } from '../../../../../packages/planet/src/public_api';
import { ProjectService } from './projects.service';
import { ThyDialog } from 'ngx-tethys/dialog/dialog.service';
import { ProjectDetailComponent } from './detail/detail.component';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit, DoCheck {
    constructor(
        private globalEventDispatcher: GlobalEventDispatcher,
        private projectService: ProjectService,
        private dialog: ThyDialog,
        private applicationRef: ApplicationRef,
        private ref: PlanetComponentRef
    ) {
        console.log(ref);
    }

    click = new EventEmitter<any>();

    projects: any[];

    loadingDone: boolean;

    search: string;

    ngOnInit() {
        this.getProjects();
    }

    getProjects() {
        this.loadingDone = false;
        setTimeout(() => {
            this.projects = this.projectService.getProjects();
            this.loadingDone = true;
        }, 2000);
    }

    openDetail() {
        this.dialog.open(ProjectDetailComponent, {
            hasBackdrop: true,
            backdropClosable: true,
            closeOnNavigation: true
        });

        this.click.emit();
    }

    ngDoCheck() {
        // this.applicationRef.tick();
        // console.log(window['appRef'] === this.applicationRef);
    }
}
