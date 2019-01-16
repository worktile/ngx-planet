import { App1ContainerComponent } from './container/container.component';
import { UserListComponent } from './users/user-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Route } from '@angular/router';

export const routers: Route[] = [
    {
        path: 'app1',
        component: App1ContainerComponent,
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            {
                path: 'users',
                component: UserListComponent
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            }
        ]
    }
];

