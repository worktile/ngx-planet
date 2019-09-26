import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, NgModuleRef, NgZone, DoBootstrap } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Route } from '@angular/router';
import { ProjectListComponent } from './projects/project-list.component';
import { AppRootComponent } from './root/root.component';
import { NgxTethysModule } from 'ngx-tethys';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmptyComponent } from './empty/empty.component';
import { ProjectDetailComponent } from './projects/detail/detail.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanetComponentLoader } from 'ngx-planet';
import { DemoCommonModule } from '@demo/common';

const routers: Route[] = [
    {
        path: 'app2',
        component: AppRootComponent,
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
        AppComponent,
        AppRootComponent,
        ProjectListComponent,
        DashboardComponent,
        EmptyComponent,
        ProjectDetailComponent
    ],
    entryComponents: [AppComponent, ProjectDetailComponent],
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        RouterModule.forRoot(routers),
        NgxTethysModule,
        DemoCommonModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private planetComponentLoader: PlanetComponentLoader) {
        this.planetComponentLoader.register([{ name: 'project1', component: ProjectListComponent }]);
    }
}
