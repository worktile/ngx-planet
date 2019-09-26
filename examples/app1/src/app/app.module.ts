import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Route } from '@angular/router';
import { UserListComponent } from './user/user-list.component';
import { NgxTethysModule } from 'ngx-tethys';
import { DashboardComponent } from './dashboard/dashboard.component';
import { routers } from './app.routing';
import { UserDetailComponent } from './user/detail/user-detail.component';
import { EmptyComponent } from './empty/empty.component';
import { AppRootComponent } from './root/root.component';
import { DemoCommonModule } from '@demo/common';

@NgModule({
    declarations: [
        AppComponent,
        AppRootComponent,
        UserListComponent,
        UserDetailComponent,
        DashboardComponent,
        EmptyComponent
    ],
    imports: [BrowserModule, RouterModule.forRoot(routers), NgxTethysModule, DemoCommonModule],
    providers: [],
    entryComponents: [UserDetailComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
