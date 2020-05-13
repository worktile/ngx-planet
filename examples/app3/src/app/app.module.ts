import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { NgxPlanetModule } from 'ngx-planet';
import { AppActualRootComponent, AppRootComponent } from './root/root.component';
import { AppDashboardComponent } from './dashboard/dashboard.component';
import { NgxTethysModule } from 'ngx-tethys';
import { DemoCommonModule } from '../../../common';

@NgModule({
    declarations: [AppActualRootComponent, AppRootComponent, AppDashboardComponent],
    imports: [BrowserModule, AppRoutingModule, NgxPlanetModule, NgxTethysModule, DemoCommonModule],
    entryComponents: [AppRootComponent, AppDashboardComponent],
    providers: [],
    bootstrap: [AppRootComponent]
})
export class AppModule {}
