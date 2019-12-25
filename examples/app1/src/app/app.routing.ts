import { DashboardComponent } from './dashboard/dashboard.component';
import { Route } from '@angular/router';
import { AppRootComponent } from './root/root.component';
import { EmptyComponent } from 'ngx-planet';

export const routers: Route[] = [
    {
        path: 'app1',
        component: AppRootComponent,
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
                loadChildren: () => import('./user/user.module').then(mod => mod.UserModule)
            }
            // {
            //     path: 'users',
            //     component: UserListComponent,
            //     children: [
            //         {
            //             path: ':id',
            //             component: UserDetailComponent
            //         }
            //     ]
            // }
        ]
    },
    {
        path: '**',
        component: EmptyComponent
    }
];
