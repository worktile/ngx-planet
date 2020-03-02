import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Route } from '@angular/router';
import { NgxTethysModule } from 'ngx-tethys';
import { DashboardComponent } from './dashboard/dashboard.component';
import { routers } from './app.routing';
import { AppRootComponent } from './root/root.component';
import { DemoCommonModule } from '@demo/common';
import { NgxPlanetModule } from 'ngx-planet';
import { UserModule } from './user/user.module';
import { ProjectsComponent } from './projects/projects.component';

@NgModule({
    declarations: [AppComponent, AppRootComponent, DashboardComponent, ProjectsComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routers),
        // UserModule,
        NgxTethysModule,
        DemoCommonModule,
        NgxPlanetModule
    ],
    providers: [],
    entryComponents: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
