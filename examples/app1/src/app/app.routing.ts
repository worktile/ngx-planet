import { UserListComponent } from './user/user-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Route } from '@angular/router';
import { UserDetailComponent } from './user/detail/user-detail.component';
import { EmptyComponent } from './empty/empty.component';
import { AppComponent } from './app.component';

export const routers: Route[] = [
    {
        path: 'app1',
        component: AppComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
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
            }
        ]
    },
    {
        path: '**',
        component: EmptyComponent
    }
];
