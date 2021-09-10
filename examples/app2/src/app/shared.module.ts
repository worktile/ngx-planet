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
import { ThyTableModule } from 'ngx-tethys/table';
import { ThyNavModule } from 'ngx-tethys/nav';
import { ThyInputModule } from 'ngx-tethys/input';
import { ThyIconModule } from 'ngx-tethys/icon';

import { DemoCommonModule } from '@demo/common';
import { NgxPlanetModule } from 'ngx-planet';
import { ThyLabelModule } from 'ngx-tethys';

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
        ThyTableModule,
        ThyNavModule,
        ThyInputModule,
        ThyIconModule,
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
        ThyTableModule,
        ThyNavModule,
        ThyInputModule,
        ThyIconModule,
        ThyLabelModule,
        DemoCommonModule,
        NgxPlanetModule
    ],
    providers: []
})
export class SharedModule {}
