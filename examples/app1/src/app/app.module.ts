import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Route } from '@angular/router';
import { UserListComponent } from './user/user-list.component';
import { NgxTethysModule } from 'ngx-tethys';
import { DashboardComponent } from './dashboard/dashboard.component';
import { routers } from './app.routing';
import { UserDetailComponent } from './user/detail/user-detail.component';

@NgModule({
    declarations: [AppComponent, UserListComponent, UserDetailComponent, DashboardComponent],
    imports: [BrowserModule, RouterModule.forRoot(routers), NgxTethysModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
