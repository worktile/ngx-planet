import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { routers } from './app.routing';
import { AppRootComponent, AppActualRootComponent } from './root/root.component';
import { DemoCommonModule, OVERLAY_PROVIDER } from '@demo/common';
import { NgxPlanetModule } from 'ngx-planet';
import { ProjectsComponent } from './projects/projects.component';
import { App1DetailComponent } from './detail/detail.component';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { AppOverlay } from './overlay';
import { ProjectsDialogComponent } from './projects/dialog/projects-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.module';

@NgModule({
    declarations: [
        AppRootComponent,
        AppActualRootComponent,
        DashboardComponent,
        ProjectsComponent,
        App1DetailComponent,
        ProjectsDialogComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routers, { relativeLinkResolution: 'legacy' }),
        // UserModule,
        FormsModule,
        SharedModule,
        DemoCommonModule,
        NgxPlanetModule,
        OverlayModule
    ],
    providers: [OVERLAY_PROVIDER, { provide: Overlay, useClass: AppOverlay }],
    entryComponents: [App1DetailComponent, ProjectsDialogComponent],
    bootstrap: [AppRootComponent]
})
export class AppModule {
    constructor() {}
}
