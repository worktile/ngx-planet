import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { SettingsComponent } from './settings/settings.component';
import { EmptyComponent } from 'ngx-planet';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'about',
        pathMatch: 'full'
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'app1',
        component: EmptyComponent,
        children: [
            {
                path: '**',
                component: EmptyComponent
            }
        ]
    },
    {
        path: 'app2',
        component: EmptyComponent,
        children: [
            {
                path: '**',
                component: EmptyComponent
            }
        ]
    },
    {
        path: 'app3',
        component: EmptyComponent,
        children: [
            {
                path: '**',
                component: EmptyComponent
            }
        ]
    },
    {
        path: 'app4',
        component: EmptyComponent,
        children: [
            {
                path: '**',
                component: EmptyComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
