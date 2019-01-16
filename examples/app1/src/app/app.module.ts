import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Route } from '@angular/router';
import { UserListComponent } from './users/user-list.component';
import { App1ContainerComponent } from './container/container.component';
import { NgxTethysModule } from 'ngx-tethys';
import { DashboardComponent } from './dashboard/dashboard.component';

const routers: Route[] = [
    {
        path: 'app1',
        component: App1ContainerComponent,
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            {
                path: 'users',
                component: UserListComponent
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            }
        ]
    }
];

@NgModule({
    declarations: [AppComponent, App1ContainerComponent, UserListComponent, DashboardComponent],
    imports: [BrowserModule, RouterModule.forRoot(routers), NgxTethysModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
