# ngx-planet

[![CircleCI](https://circleci.com/gh/worktile/ngx-planet.svg?style=shield)](https://circleci.com/gh/worktile/ngx-planet)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/@worktile/planet?style=flat)](https://www.npmjs.com/package/@worktile/planet)
[![npm](https://img.shields.io/npm/dm/@worktile/planet)](https://www.npmjs.com/package/@worktile/planet)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@worktile/planet)

[coveralls-image]: https://coveralls.io/repos/github/worktile/ngx-planet/badge.svg
[coveralls-url]: https://coveralls.io/github/worktile/ngx-planet

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

        this.planet.registerApps([
            {
                name: 'app1',
                hostParent: '#app-host-container',
                hostClass: 'thy-layout',
                routerPathPrefix: '/app1',
                selector: 'app1-root-container',
                resourcePathPrefix: '/static/app1',
                preload: true,
                scripts: [
                    'main.js'
                ],
                styles: [
                    'styles.css'
                ]
            },
            {
                name: 'app2',
                hostParent: '#app-host-container',
                hostClass: 'thy-layout',
                routerPathPrefix: '/app2',
                selector: 'app2-root-container',
                preload: true,
                scripts: [
                    '/static/app2/main.js'
                ],
                styles: [
                    '/static/app2/styles.css'
                ]
            }
        ]);

        this.planet.start();

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
npm run start // open http://localhost:3000

or

npm run serve:portal // 3000
npm run serve:app1 // 3001
npm run serve:app2 // 3002

// test
npm run test
```

## LICENSE

[MIT License](https://github.com/worktile/ngx-planet/blob/master/LICENSE)
