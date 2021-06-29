import { CommonModule } from '@angular/common';
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
import { ThyTableModule } from 'ngx-tethys/table';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThyLoadingModule } from 'ngx-tethys/loading';
import { ThyNavModule } from 'ngx-tethys/nav';
import { ThyActionMenuModule } from 'ngx-tethys/action-menu';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyFormModule } from 'ngx-tethys/form';
import { ThyRadioModule } from 'ngx-tethys/radio';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';
import { ADetailComponent } from './a-detail/a-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { AppRootContext, DemoCommonModule, OVERLAY_PROVIDER } from '@demo/common';
import { FormsModule } from '@angular/forms';
import { Overlay } from '@angular/cdk/overlay';
import { AppOverlay } from './overlay';

@NgModule({
    declarations: [AppComponent, AboutComponent, SettingsComponent, ADetailComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        CommonModule,
        ThyIconModule,
        ThyButtonModule,
        ThyDialogModule,
        ThyTableModule,
        ThyLayoutModule,
        ThyNotifyModule,
        ThyLoadingModule,
        ThyNavModule,
        ThyActionMenuModule,
        ThyTooltipModule,
        ThyPopoverModule,
        ThyFormModule,
        ThyRadioModule,
        ThyCheckboxModule,
        AppRoutingModule,
        NgxPlanetModule,
        DemoCommonModule
    ],
    providers: [AppRootContext, OVERLAY_PROVIDER, { provide: Overlay, useClass: AppOverlay }],
    bootstrap: [AppComponent],
    entryComponents: [ADetailComponent]
})
export class AppModule {
    constructor(iconRegistry: ThyIconRegistry, domSanitizer: DomSanitizer) {
        iconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/sprite.defs.svg'));
    }
}
