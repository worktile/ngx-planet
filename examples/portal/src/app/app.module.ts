import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxTethysModule } from 'ngx-tethys';
import { AboutComponent } from './about/about.component';
import { HostContainerComponent } from './host-container/host-container.component';
import { NgxPlanetModule } from 'ngx-planet';
import { ThyDialogModule, ThyIconRegistry } from 'ngx-tethys';
import { ADetailComponent } from './a-detail/a-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { AppRootContext, DemoCommonModule } from '@demo/common';

@NgModule({
    declarations: [AppComponent, AboutComponent, SettingsComponent, HostContainerComponent, ADetailComponent],
    imports: [BrowserModule, NgxTethysModule, ThyDialogModule, AppRoutingModule, NgxPlanetModule, DemoCommonModule],
    providers: [AppRootContext],
    bootstrap: [AppComponent],
    entryComponents: [ADetailComponent]
})
export class AppModule {
    constructor(iconRegistry: ThyIconRegistry, domSanitizer: DomSanitizer) {
        iconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/sprite.defs.svg'));
    }
}
