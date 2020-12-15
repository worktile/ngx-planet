import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { routers } from './app.routing';
import { AppRootComponent, AppActualRootComponent } from './root/root.component';
import { DemoCommonModule } from '@demo/common';
import { NgxPlanetModule } from 'ngx-planet';
import { ProjectsComponent } from './projects/projects.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.module';

@NgModule({
    declarations: [AppRootComponent, AppActualRootComponent, DashboardComponent, ProjectsComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routers),
        SharedModule,
        DemoCommonModule,
        NgxPlanetModule
    ],
    providers: [],
    entryComponents: [],
    bootstrap: [AppRootComponent]
})
export class AppModule {}
