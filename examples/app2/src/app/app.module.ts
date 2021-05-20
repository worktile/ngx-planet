import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Route } from '@angular/router';
import { ProjectListComponent } from './projects/project-list.component';
import { AppRootComponent, AppActualRootComponent } from './root/root.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectDetailComponent } from './projects/detail/detail.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmptyComponent, NgxPlanetModule } from 'ngx-planet';
import { DemoCommonModule, OVERLAY_PROVIDER } from '@demo/common';
import { ProjectResolver } from './projects/project.resolver';
import { TasksComponent } from './projects/tasks/tasks.component';
import { ViewComponent } from './projects/view/view.component';
import { Overlay } from '@angular/cdk/overlay';
import { AppOverlay } from './overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.module';

const routers: Route[] = [
    {
        path: 'app2',
        component: AppActualRootComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'projects',
                component: ProjectListComponent
            },
            {
                path: 'projects/:id',
                component: ProjectDetailComponent,
                resolve: {
                    project: ProjectResolver
                },
                children: [
                    {
                        path: 'tasks',
                        component: TasksComponent,
                        children: [
                            {
                                path: ':viewId',
                                component: ViewComponent
                            }
                        ]
                    }
                ]
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            }
        ]
    },
    {
        path: '**',
        component: EmptyComponent
    }
];

@NgModule({
    declarations: [
        AppActualRootComponent,
        AppRootComponent,
        ProjectListComponent,
        DashboardComponent,
        ProjectDetailComponent,
        TasksComponent,
        ViewComponent
    ],
    entryComponents: [AppRootComponent, ProjectDetailComponent],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        BrowserModule,
        RouterModule.forRoot(routers, { relativeLinkResolution: 'legacy' }),
        SharedModule,
        DemoCommonModule,
        NgxPlanetModule
    ],
    providers: [OVERLAY_PROVIDER, { provide: Overlay, useClass: AppOverlay }],
    bootstrap: [AppRootComponent]
})
export class AppModule {}
