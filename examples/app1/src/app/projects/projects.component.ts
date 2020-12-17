import { Observable } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlanetComponentLoader } from 'ngx-planet';

@Component({
    selector: 'app-projects',
    template: `
        <section-card class="mt-2" title="App2's projects component">
            <thy-loading [thyDone]="loadingDone"></thy-loading>
            <div #container></div>
        </section-card>
    `
})
export class ProjectsComponent implements OnInit {
    @ViewChild('container', { static: true }) elementRef: ElementRef<HTMLDivElement>;

    loadingDone = false;

    constructor(private planetComponentLoader: PlanetComponentLoader) {}

    ngOnInit() {
        this.planetComponentLoader
            .load<{ click: Observable<unknown> }>('app2', 'project1', {
                container: this.elementRef
            })
            .subscribe(componentRef => {
                this.loadingDone = true;
                componentRef.componentInstance.click.subscribe(() => {
                    console.log('project item clicked');
                });
            });
    }
}
