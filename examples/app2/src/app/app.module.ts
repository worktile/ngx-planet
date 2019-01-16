import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Route } from '@angular/router';
import { ProjectListComponent } from './projects/project-list.component';
import { App1ContainerComponent } from './container/container.component';
import { NgxTethysModule } from 'ngx-tethys';
import { DashboardComponent } from './dashboard/dashboard.component';

const routers: Route[] = [
    {
        path: 'app2',
        component: App1ContainerComponent,
        children: [
            {
                path: '',
                redirectTo: 'projects',
                pathMatch: 'full'
            },
            {
                path: 'projects',
                component: ProjectListComponent
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            }
        ]
    }
];

@NgModule({
    declarations: [AppComponent, App1ContainerComponent, ProjectListComponent, DashboardComponent],
    imports: [BrowserModule, RouterModule.forRoot(routers), NgxTethysModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
