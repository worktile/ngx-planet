import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxTethysModule } from 'ngx-tethys';
import { AboutComponent } from './about/about.component';
import { LoadAppComponent } from './load-app/load-app.component';
import { NgxMicroModule } from '../../packages/micro-core/src/public_api';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ADetailComponent } from './a-detail/a-detail.component';

@NgModule({
    declarations: [AppComponent, AboutComponent, LoadAppComponent, ADetailComponent],
    imports: [BrowserModule, NgxTethysModule, ThyDialogModule, AppRoutingModule, NgxMicroModule],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [ADetailComponent]
})
export class AppModule {}
