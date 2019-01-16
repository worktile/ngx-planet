import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Route } from '@angular/router';
import { UserListComponent } from './users/user-list.component';
import { App1ContainerComponent } from './container/container.component';
import { NgxTethysModule } from 'ngx-tethys';
import { DashboardComponent } from './dashboard/dashboard.component';
import { routers } from './app.routing';


@NgModule({
    declarations: [AppComponent, App1ContainerComponent, UserListComponent, DashboardComponent],
    imports: [BrowserModule, RouterModule.forRoot(routers), NgxTethysModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
