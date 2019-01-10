import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxTethysModule } from 'ngx-tethys';
import { AboutComponent } from './about/about.component';
import { LoadAppComponent } from './load-app/load-app.component';

@NgModule({
    declarations: [AppComponent, AboutComponent, LoadAppComponent],
    imports: [BrowserModule, NgxTethysModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
