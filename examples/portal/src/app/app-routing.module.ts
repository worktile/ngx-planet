import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HostContainerComponent } from './host-container/host-container.component';
import { SettingsComponent } from './settings/settings.component';

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
        component: HostContainerComponent,
        children: [
            {
                path: '**',
                component: HostContainerComponent
            }
        ]
    },
    {
        path: 'app2',
        component: HostContainerComponent,
        children: [
            {
                path: '**',
                component: HostContainerComponent
            }
        ]
    },
    {
        path: 'app4',
        component: HostContainerComponent,
        children: [
            {
                path: '**',
                component: HostContainerComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
