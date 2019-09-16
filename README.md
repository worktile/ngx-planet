# ngx-planet [![Build Status](https://travis-ci.org/worktile/ngx-planet.svg?branch=master)](https://travis-ci.org/worktile/ngx-planet)

An Angular 7+ Micro Frontend library.

## Installation

```
npm i @worktile/planet --save
```

## Demo

![ngx-planet-micro-front-end.gif](https://github.com/worktile/ngx-planet/blob/master/examples/portal/src/assets/ngx-planet-micro-front-end.gif?raw=true)

## Usage

### 1. Loading the module in the portal app module

```
import { NgxPlanetModule } from '@worktile/planet';

@NgModule({
  imports: [
    CommonModule,
    NgxPlanetModule
  ]
})
class AppModule {}
```

### 2. Register Applications to planet use Planet Service in portal app

```
@Component({
    selector: 'app-portal-root',
    template: `
<nav>
    <a [routerLink]="['/app1']" routerLinkActive="active">应用1</a>
    <a [routerLink]="['/app2']" routerLinkActive="active">应用2</a>
</nav>
<router-outlet></router-outlet>
<div id="app-host-container"></div>
<div *ngIf="!loadingDone">加载中...</div>
    `
})
export class AppComponent implements OnInit {
    title = 'ngx-planet';

    get loadingDone() {
        return this.planet.loadingDone;
    }

    constructor(
        private planet: Planet,
        private router: Router,
        private globalEventDispatcher: GlobalEventDispatcher
    ) {}

    ngOnInit() {
        this.planet.setOptions({
            switchMode: SwitchModes.coexist,
            errorHandler: error => {
                this.thyNotify.error(`错误`, '加载资源失败');
            }
        });

        const appHostContainerSelector = '#app-host-container';
        const appHostContainerClass = 'thy-layout';

        this.planet.registerApps([
            {
                name: 'app1',
                host: appHostContainerSelector,
                hostClass: appHostContainerClass,
                routerPathPrefix: '/app1',
                selector: 'app1-root-container',
                scriptPathPrefix: 'app1/assets/',
                preload: true,
                // prettier-ignore
                scripts: [
                    'main.js'
                ]
            },
            {
                name: 'app2',
                host: appHostContainerSelector,
                hostClass: appHostContainerClass,
                routerPathPrefix: '/app2',
                selector: 'app2-root-container',
                // preload: true,
                // prettier-ignore
                scripts: [
                    'app2/assets/main.js'
                ]
            }
        ]);

        this.router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd) {
                this.planet.resetRouting(event);
            }
        });

        this.globalEventDispatcher.register('openADetail').subscribe(event => {
            // open a Detail
        });
    }
}
```

### 3. Sub Apps define app to bootstrap app module

```
defineApplication('app1', (portalApp: PlanetPortalApplication) => {
    return platformBrowserDynamic([
        {
            provide: PlanetPortalApplication,
            useValue: portalApp
        }
    ])
        .bootstrapModule(AppModule)
        .then(appModule => {
            return appModule;
        })
        .catch(error => {
            console.error(error);
            return null;
        });
});
```

## Development

```
npm run serve:portal // 3000
npm run serve:app1 // 3001
npm run serve:app2 // 3002

or

npm start
```

open http://localhost:3000
