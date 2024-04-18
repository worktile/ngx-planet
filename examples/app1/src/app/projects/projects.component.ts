import { Observable, Subject } from 'rxjs';
import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    OnDestroy,
    TemplateRef,
    EnvironmentInjector,
    inject,
    ViewContainerRef,
    Injector,
    signal,
    createEnvironmentInjector,
    ApplicationRef
} from '@angular/core';
import { PlanetComponentLoader, PlanetComponentRef } from '@worktile/planet';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-projects',
    template: `
        <section-card class="mt-2" title="App2's projects component">
            <ng-template #operation>
                <button thyButton="primary">New</button> <a *ngIf="hasEditPermission()" href="javascript:;" class="ml-4">Edit</a>
            </ng-template>

            <thy-tabs (thyActiveTabChange)="activeTabChange($event)">
                <thy-tab id="planet-component-outlet" thyTitle="PlanetComponentOutlet">
                    <ng-container
                        *planetComponentOutlet="
                            'app-project-list';
                            app: 'app2';
                            projectableNodes: [operation];
                            initialState: { search: 'From PlanetComponentOutlet' }
                        ">
                    </ng-container>
                    <!-- <ng-container
                        planetComponentOutlet="project1"
                        planetComponentOutletApp="app2"
                        [planetComponentOutletInitialState]="{ search: 'From PlanetComponentOutlet' }"
                        (planetComponentLoaded)="planetComponentLoaded($event)"
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

    @ViewChild('operation') operationTemplateRef: TemplateRef<unknown>;

    loadingDone = false;

    destroyed$ = new Subject<void>();

    componentRef: PlanetComponentRef;

    injector = inject(EnvironmentInjector);

    viewContainerRef = inject(ViewContainerRef);

    applicationRef = inject(ApplicationRef);

    hasEditPermission = signal(false);

    constructor(private planetComponentLoader: PlanetComponentLoader) {}

    ngOnInit() {
        // 模拟异步返回数据，projectableNodes 的模板根据数据触发变更监测
        setTimeout(() => {
            this.hasEditPermission.set(true);
        }, 1000);
    }

    activeTabChange(event: string) {
        if (event === 'planet-component-loader') {
            this.loadManual();
        }
    }

    loadManual() {
        this.componentRef?.dispose();
        this.planetComponentLoader
            .load<{ click: Observable<unknown> }>('app2', 'app-project-list', {
                container: this.container,
                projectableNodes: [this.operationTemplateRef], // [[div], [div2], [div3]],
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

    planetComponentLoaded = ($event: PlanetComponentRef) => {
        this.loadingDone = true;
    };

    ngOnDestroy(): void {
        this.componentRef?.dispose();
    }
}
