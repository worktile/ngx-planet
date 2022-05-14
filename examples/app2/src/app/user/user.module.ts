import { NgModule } from '@angular/core';
import { ThyListModule } from 'ngx-tethys/list';
import { UserListComponent } from './user-list.component';
import { DemoCommonModule } from '@demo/common';
import { NgxPlanetModule } from 'ngx-planet';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';

@NgModule({
    declarations: [UserListComponent],
    imports: [
        SharedModule,
        ThyListModule,
        RouterModule.forChild([
            {
                path: '',
                component: UserListComponent
            }
        ])
    ],
    exports: [UserListComponent],
    providers: []
})
export class UserModule {}
