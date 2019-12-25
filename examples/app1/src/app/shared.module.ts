import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThyLayoutModule, ThyButtonModule, ThyListModule, ThyDialogModule } from 'ngx-tethys';
import { DemoCommonModule } from '@demo/common';
import { NgxPlanetModule } from 'ngx-planet';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule,
        ThyLayoutModule,
        ThyButtonModule,
        ThyListModule,
        ThyDialogModule,
        DemoCommonModule,
        NgxPlanetModule
    ],
    exports: [
        CommonModule,
        RouterModule,
        ThyLayoutModule,
        ThyButtonModule,
        ThyListModule,
        ThyDialogModule,
        DemoCommonModule,
        NgxPlanetModule
    ],
    providers: []
})
export class SharedModule {}
