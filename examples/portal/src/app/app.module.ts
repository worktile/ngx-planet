import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxTethysModule } from 'ngx-tethys';
import { AboutComponent } from './about/about.component';
import { NgxPlanetModule } from 'ngx-planet';
import { ThyDialogModule, ThyIconRegistry } from 'ngx-tethys';
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
        FormsModule,
        NgxTethysModule,
        ThyDialogModule,
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
        iconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/sprite.defs.svg'));
    }
}
