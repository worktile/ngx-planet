import { Routes } from '@angular/router';
import { AppRootActualComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmptyComponent, redirectToRoute } from '@worktile/planet';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
    {
        path: 'standalone-app',
        component: AppRootActualComponent,
        children: [
            redirectToRoute('dashboard'),
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'about',
                component: AboutComponent,
            },
        ],
    },
    {
        path: '**',
        component: EmptyComponent,
    },
];
