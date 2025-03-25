import { Component, ElementRef, EventEmitter, HostBinding, OnInit, ViewChild } from '@angular/core';
import { PlanetComponentLoader } from '@worktile/planet';
import { ThyDialogRef } from 'ngx-tethys/dialog';

@Component({
    selector: 'app-projects-dialog',
    templateUrl: `./projects-dialog.component.html`,
    standalone: false
})
export class ProjectsDialogComponent implements OnInit {
    @HostBinding('class.thy-dialog-content') container = true;

    @ViewChild('container', { static: true }) elementRef: ElementRef<HTMLDivElement>;

    loadingDone = false;

    constructor(
        private planetComponentLoader: PlanetComponentLoader,
        private dialogRef: ThyDialogRef<ProjectsDialogComponent>
    ) {}

    ngOnInit() {
        this.planetComponentLoader
            .load<{ click: EventEmitter<any> }>('app2', 'app-project-list', {
                container: this.elementRef
            })
            .subscribe(componentRef => {
                this.loadingDone = true;
                componentRef.componentInstance.click.subscribe(() => {
                    console.log('project item clicked');
                });
            });
    }

    ok() {
        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }
}
