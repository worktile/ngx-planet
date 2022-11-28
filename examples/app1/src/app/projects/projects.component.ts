import { Observable, Subject } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PlanetComponentLoader, PlanetComponentRef } from 'ngx-planet';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-projects',
    template: `
        <section-card class="mt-2" title="App2's projects component">
            <thy-tabs (thyActiveTabChange)="activeTabChange($event)">
                <thy-tab id="planet-component-outlet" thyTitle="PlanetComponentOutlet">
                    <ng-container
                        *planetComponentOutlet="
                            'project1';
                            app: 'app2';
                            initialState: { search: 'From PlanetComponentOutlet' }
                        "
                    ></ng-container>
                    <!-- <ng-container
                        planetComponentOutlet="project1"
                        planetComponentOutletApp="app2"
                        (planetComponentLoad)="planetComponentLoad($event)"
                    ></ng-container> -->
                </thy-tab>
                <thy-tab id="planet-component-loader" thyTitle="PlanetComponentLoader">
                    <div #container></div>
                </thy-tab>
            </thy-tabs>
            <!-- <thy-loading [thyDone]="loadingDone"></thy-loading> -->
        </section-card>
    `
})
export class ProjectsComponent implements OnInit, OnDestroy {
    @ViewChild('container', { static: true }) container: ElementRef<HTMLDivElement>;

    loadingDone = false;

    destroyed$ = new Subject<void>();

    componentRef: PlanetComponentRef;

    constructor(private planetComponentLoader: PlanetComponentLoader) {}

    ngOnInit() {}

    activeTabChange(event: string) {
        if (event === 'planet-component-loader') {
            this.loadManual();
        }
    }

    loadManual() {
        this.componentRef?.dispose();
        this.planetComponentLoader
            .load<{ click: Observable<unknown> }>('app2', 'project1', {
                container: this.container,
                initialState: {
                    search: 'From PlanetComponentLoader'
                },
                wrapperClass: 'wrapper-class'
            })
            .pipe(takeUntil(this.destroyed$))
            .subscribe(componentRef => {
                this.loadingDone = true;
                this.componentRef = componentRef;
                componentRef.componentInstance.click.subscribe(() => {
                    console.log('project item clicked');
                });
            });
    }

    planetComponentLoad = ($event: PlanetComponentRef) => {
        this.loadingDone = true;
    };

    ngOnDestroy(): void {
        this.componentRef?.dispose();
    }
}
