import { CommonModule } from '@angular/common';
import { NgModule, inject } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Overlay } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { AppRootContext, DemoCommonModule, OVERLAY_PROVIDER } from '@demo/common';
import { NgxPlanetModule } from '@worktile/planet';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyFormModule } from 'ngx-tethys/form';
import { ThyIconModule, ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyLoadingModule } from 'ngx-tethys/loading';
import { ThyNavModule } from 'ngx-tethys/nav';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyRadioModule } from 'ngx-tethys/radio';
import { ThyTableModule } from 'ngx-tethys/table';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ADetailComponent } from './a-detail/a-detail.component';
import { AboutComponent } from './about/about.component';
import { PortalCustomComponent } from './about/components/portal-custom.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppOverlay } from './overlay';
import { SettingsComponent } from './settings/settings.component';
import { SlateModule } from 'slate-angular';
import { TheEditorModule } from '@worktile/theia';
import { AppTheiaComponent } from './theia/theia.component';

@NgModule({
    declarations: [AppComponent, AboutComponent, AppTheiaComponent, PortalCustomComponent, SettingsComponent, ADetailComponent],
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
        ThyDropdownModule,
        ThyTooltipModule,
        ThyPopoverModule,
        ThyFormModule,
        ThyRadioModule,
        ThyCheckboxModule,
        AppRoutingModule,
        NgxPlanetModule,
        DemoCommonModule,
        SlateModule,
        TheEditorModule
    ],
    providers: [AppRootContext, OVERLAY_PROVIDER, { provide: Overlay, useClass: AppOverlay }],
    bootstrap: [AppComponent]
})
export class AppModule {
    private router = inject(Router);

    constructor() {
        const iconRegistry = inject(ThyIconRegistry);
        const domSanitizer = inject(DomSanitizer);

        iconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/sprite.defs.svg'));

        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                console.log(`[Portal] url: ${event.url}, id: ${event.id}, navigationTrigger: ${event.navigationTrigger}`);
            }
        });
    }
}
