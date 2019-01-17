import { UserListComponent } from './user/user-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Route } from '@angular/router';
import { UserDetailComponent } from './user/detail/user-detail.component';

export const routers: Route[] = [
    {
        path: 'app1',
        // component: EmptyOutletComponent,
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            {
                path: 'users',
                component: UserListComponent,
                children: [
                    {
                        path: ':id',
                        component: UserDetailComponent
                    }
                ]
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            }
        ]
    }
];
