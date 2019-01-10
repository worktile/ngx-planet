import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LoadAppComponent } from './load-app/load-app.component';

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
        path: 'app1',
        component: LoadAppComponent
    },
    {
        path: 'app1/:routeName',
        component: LoadAppComponent
    },
    {
        path: 'app2',
        component: LoadAppComponent
    },
    {
        path: 'app2/:routeName',
        component: LoadAppComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
