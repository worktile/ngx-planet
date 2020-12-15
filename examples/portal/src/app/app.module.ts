import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { NgxPlanetModule } from 'ngx-planet';
import { ThyIconModule, ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyGridModule } from 'ngx-tethys/grid';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThyLoadingModule } from 'ngx-tethys/loading';
import { ThyNavModule } from 'ngx-tethys/nav';
import { ThyActionMenuModule } from 'ngx-tethys/action-menu';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyFormModule } from 'ngx-tethys/form';
import { ThyRadioModule } from 'ngx-tethys/radio';
import { ADetailComponent } from './a-detail/a-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { AppRootContext, DemoCommonModule } from '@demo/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [AppComponent, AboutComponent, SettingsComponent, ADetailComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ThyIconModule,
        ThyButtonModule,
        ThyDialogModule,
        ThyGridModule,
        ThyLayoutModule,
        ThyNotifyModule,
        ThyLoadingModule,
        ThyNavModule,
        ThyActionMenuModule,
        ThyTooltipModule,
        ThyPopoverModule,
        ThyFormModule,
        ThyRadioModule,
        AppRoutingModule,
        NgxPlanetModule,
        DemoCommonModule
    ],
    providers: [AppRootContext],
    bootstrap: [AppComponent],
    entryComponents: [ADetailComponent]
})
export class AppModule {
    constructor(iconRegistry: ThyIconRegistry, domSanitizer: DomSanitizer) {
        iconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/sprite.defs.svg'));
    }
}
