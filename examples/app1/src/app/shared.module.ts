import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyListModule } from 'ngx-tethys/list';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyMenuModule } from 'ngx-tethys/menu';
import { ThyCardModule } from 'ngx-tethys/card';
import { ThyLoadingModule } from 'ngx-tethys/loading';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyInputModule } from 'ngx-tethys/input';
import { ThyFormModule } from 'ngx-tethys/form';
import { ThySelectModule } from 'ngx-tethys/select';

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
        ThyMenuModule,
        ThyCardModule,
        ThyLoadingModule,
        ThyIconModule,
        ThyInputModule,
        ThyFormModule,
        ThySelectModule,
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
        ThyMenuModule,
        ThyCardModule,
        ThyLoadingModule,
        ThyIconModule,
        ThyInputModule,
        ThyFormModule,
        ThySelectModule,
        DemoCommonModule,
        NgxPlanetModule
    ],
    providers: []
})
export class SharedModule {}
