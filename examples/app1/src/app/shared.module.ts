import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { ThyLayoutModule, ThyButtonModule, ThyListModule, ThyDialogModule } from 'ngx-tethys';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyListModule } from 'ngx-tethys/list';
import { ThyDialogModule } from 'ngx-tethys/dialog';

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
