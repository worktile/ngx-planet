# ngx-planet

[![CircleCI](https://circleci.com/gh/worktile/ngx-planet.svg?style=shield)](https://circleci.com/gh/worktile/ngx-planet)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/@worktile/planet?style=flat)](https://www.npmjs.com/package/@worktile/planet)
[![npm](https://img.shields.io/npm/dm/@worktile/planet)](https://www.npmjs.com/package/@worktile/planet)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@worktile/planet) [![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)

[coveralls-image]: https://coveralls.io/repos/github/worktile/ngx-planet/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/worktile/ngx-planet

A powerful, reliable, fully-featured and production ready Micro Frontend library for Angular.

APIs consistent with angular style, currently only supports Angular, other frameworks are not supported.

## Features

-   Rendering multiple applications at the same time
-   Support coexist mode
-   Application preload
-   Communication between multiple applications
-   Cross application component rendering
-   Comprehensive examples include routing configuration, lazy loading and all features
-   Support latest Angular 8.x version

## Other solutions for Micro Front-end

-   [single-spa](https://github.com/CanopyTax/single-spa): A javascript front-end framework supports any frameworks.
-   [mooa](https://github.com/phodal/mooa): A independent-deployment micro-frontend Framework for Angular from single-spa, `planet` is very similar to it, but `planet` is more powerful, more reliable, and more production ready, more angular.

## Installation

```
npm i @worktile/planet --save
// or
yarn add @worktile/planet
```

## Demo

[Try out our live demo](http://planet.ngnice.com)

![ngx-planet-micro-front-end.gif](https://github.com/worktile/ngx-planet/blob/master/examples/portal/src/assets/ngx-planet-micro-front-end.gif?raw=true)

## Usage

### 1. Loading NgxPlanetModule in the portal's AppModule

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

### 2. Register applications to planet use PlanetService in portal app

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

        // start monitor route changes
        // get apps to active by current path
        // load static resources which contains javascript and css
        // bootstrap angular sub app module and show it
        this.planet.start();
    }
}
```

### 3. Sub App define how to bootstrap AppModule

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

## Documents

### Sub app configurations

| Name               | Type                  | Description                                                                    | 中文描述                                                                                                                                                                |
| ------------------ | --------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name               | string                | Application's name                                                             | 子应用的名字                                                                                                                                                            |
| routerPathPrefix   | string                | Application route path prefix                                                  | 子应用路由路径前缀，根据这个匹配应用                                                                                                                                    |
| selector           | string                | selector of app root component                                                 | 子应用的启动组件选择器，因为子应用是主应用动态加载的，所以主应用需要先创建这个选择器节点，再启动 AppModule                                                              |
| scripts            | string[]              | javascript static resource paths                                               | JS 静态资源文件访问地址                                                                                                                                                 |
| styles             | string[]              | style static resource paths                                                    | 样式静态资源文件访问地址                                                                                                                                                |
| resourcePathPrefix | string                | path prefix of scripts and styles                                              | 脚本和样式文件路径前缀，多个脚本可以避免重复写同样的前缀                                                                                                                |
| hostParent         | string or HTMLElement | parent element for render                                                      | 应用渲染的容器元素, 指定子应用显示在哪个元素内部                                                                                                                        |
| hostClass          | string                | added class for host which is selector                                         | 宿主元素的 Class，也就是在子应用启动组件上追加的样式                                                                                                                    |
| switchMode         | default or coexist    | it will be destroyed when set to default, it only hide app when set to coexist | 切换子应用的模式，默认切换会销毁，设置 coexist 后只会隐藏                                                                                                               |
| preload            | boolean               | start preload or not                                                           | 是否启用预加载，启动后刷新页面等当前页面的应用渲染完毕后预加载子应用                                                                                                    |
| loadSerial         | boolean               | serial load scripts                                                            | 是否串行加载脚本静态资源                                                                                                                                                |
| manifest           | string                | manifest json file path                                                        | manifest.json 文件路径地址，当设置了路径后会先加载这个文件，然后根据 scripts 和 styles 文件名去找到匹配的文件，因为生产环境的静态资文件是 hash 之后的命名，需要动态获取 |

### Communication between applications use GlobalEventDispatcher

```
import { GlobalEventDispatcher } from "@worktile/planet";

// app1 root module
export class AppModule {
    constructor(private globalEventDispatcher: GlobalEventDispatcher) {
        this.globalEventDispatcher.register('open-a-detail').subscribe(event => {
            // dialog.open(App1DetailComponent);
        });
    }
}

// in other apps
export class OneComponent {
    constructor(private globalEventDispatcher: GlobalEventDispatcher) {
    }

    openDetail() {
        this.globalEventDispatcher.dispatch('open-a-detail', payload);
    }
}
```

### Cross application component rendering

```
import { PlanetComponentLoader } from "@worktile/planet";

// in app1
export class AppModule {
    constructor(private planetComponentLoader: PlanetComponentLoader) {
        this.planetComponentLoader.register([{ name: 'app1-project-list', component: App1ProjectListComponent }]);
    }
}

// in other apps
export class OneComponent {
    constructor(private planetComponentLoader: PlanetComponentLoader) {
    }

    openDetail() {
        this.planetComponentLoader.load('app1', 'app1-project-list', {
            container: this.containerElementRef,
            initialState: {}
        });
    }
}

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

## Roadmap

-   [ ] Ivy render engine
-   [ ] Supports Other frameworks as React and Vue

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.zhihu.com/people/why520crazy/activities"><img src="https://avatars2.githubusercontent.com/u/3959960?v=4" width="100px;" alt=""/><br /><sub><b>why520crazy</b></sub></a><br /><a href="#question-why520crazy" title="Answering Questions">💬</a> <a href="#business-why520crazy" title="Business development">💼</a> <a href="https://github.com/why520crazy/ngx-planet/commits?author=why520crazy" title="Code">💻</a> <a href="#design-why520crazy" title="Design">🎨</a> <a href="https://github.com/why520crazy/ngx-planet/commits?author=why520crazy" title="Documentation">📖</a> <a href="#eventOrganizing-why520crazy" title="Event Organizing">📋</a> <a href="#infra-why520crazy" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-why520crazy" title="Maintenance">🚧</a> <a href="#projectManagement-why520crazy" title="Project Management">📆</a> <a href="https://github.com/why520crazy/ngx-planet/pulls?q=is%3Apr+reviewed-by%3Awhy520crazy" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/walkerkay"><img src="https://avatars1.githubusercontent.com/u/15701592?v=4" width="100px;" alt=""/><br /><sub><b>Walker</b></sub></a><br /><a href="https://github.com/why520crazy/ngx-planet/commits?author=walkerkay" title="Code">💻</a> <a href="#example-walkerkay" title="Examples">💡</a> <a href="#maintenance-walkerkay" title="Maintenance">🚧</a> <a href="https://github.com/why520crazy/ngx-planet/pulls?q=is%3Apr+reviewed-by%3Awalkerkay" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://whyour.cn"><img src="https://avatars3.githubusercontent.com/u/22700758?v=4" width="100px;" alt=""/><br /><sub><b>whyour</b></sub></a><br /><a href="https://github.com/why520crazy/ngx-planet/commits?author=whyour" title="Code">💻</a></td>
    <td align="center"><a href="http://www.231jx.cn"><img src="https://avatars0.githubusercontent.com/u/19969080?v=4" width="100px;" alt=""/><br /><sub><b>张威</b></sub></a><br /><a href="https://github.com/why520crazy/ngx-planet/commits?author=aoilti" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## LICENSE

[MIT License](https://github.com/worktile/ngx-planet/blob/master/LICENSE)
