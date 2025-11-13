import { Component, EventEmitter, OnInit, DoCheck, HostBinding, inject } from '@angular/core';
import { ProjectService } from './projects.service';
import { Router } from '@angular/router';
import { ThyTableRowEvent } from 'ngx-tethys/table';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    standalone: false
})
export class ProjectListComponent implements OnInit, DoCheck {
    private router = inject(Router);

    private projectService = inject(ProjectService);

    @HostBinding('class') class = 'thy-layout';

    constructor() {}

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
        }, 500);
    }

    openDetail(event: ThyTableRowEvent) {
        this.router.navigateByUrl(`/app2/projects/${event.row.id}`);
        this.click.emit();
        // this.dialog.open(ProjectDetailComponent, {
        //     hasBackdrop: true,
        //     backdropClosable: true,
        //     closeOnNavigation: true
        // });
    }

    ngDoCheck() {
        // this.applicationRef.tick();
        // console.log(window['appRef'] === this.applicationRef);
    }
}
