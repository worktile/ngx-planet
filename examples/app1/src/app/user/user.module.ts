import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './detail/user-detail.component';
import { DemoCommonModule } from '@demo/common';
import { NgxPlanetModule } from 'ngx-planet';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';

@NgModule({
    declarations: [UserListComponent, UserDetailComponent],
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: UserListComponent,
                children: [
                    {
                        path: ':id',
                        component: UserDetailComponent
                    }
                ]
            }
        ])
    ],
    exports: [UserListComponent, UserDetailComponent],
    entryComponents: [UserDetailComponent],
    providers: []
})
export class UserModule {}
