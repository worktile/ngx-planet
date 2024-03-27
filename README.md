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

English | [中文文档](https://github.com/worktile/ngx-planet/blob/master/README.zh-CN.md)

## ✨ Features

- Rendering multiple applications at the same time
- Support two mode, coexist and default that switch to another app and destroy active apps
- Support application preload
- Support style isolation
- Built-in communication between multiple applications
- Cross application component rendering
- Comprehensive examples include routing configuration, lazy loading and all features

## 📖 Documentation
- [Introduce](http://planet.ngnice.com/guides/intro)
- [Getting Started](http://planet.ngnice.com/guides/getting-started)
- [Development and Build](http://planet.ngnice.com/guides/dev-build)
- [Data shared and Communication](http://planet.ngnice.com/guides/communication)
- [Cross Application Component rendering](http://planet.ngnice.com/guides/cross-app-comp-rendering)
- [API References](http://planet.ngnice.com/guides/api)

## Alternatives

-   [single-spa](https://github.com/CanopyTax/single-spa): A javascript front-end framework supports any frameworks.
-   [mooa](https://github.com/phodal/mooa): A independent-deployment micro-frontend Framework for Angular from single-spa, `planet` is very similar to it, but `planet` is more powerful, reliable, productively and more angular.

## Installation

```bash
$ npm i @worktile/planet --save
// or
$ yarn add @worktile/planet
```

## Demo

[Try out our live demo](http://planet-examples.ngnice.com)

![ngx-planet-micro-front-end.gif](https://cdn.pingcode.com/open-sources/ngx-planet/ngx-planet-micro-front-end.gif)

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

```ts
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
        private planet: Planet
    ) {}

    ngOnInit() {
        this.planet.setOptions({
            switchMode: SwitchModes.coexist,
            errorHandler: error => {
                console.error(`Failed to load resource, error:`, error);
            }
        });

        this.planet.registerApps([
            {
                name: 'app1',
                hostParent: '#app-host-container',
                hostClass: 'thy-layout',
                routerPathPrefix: '/app1',
                preload: true,
                entry: "/static/app2/index.html"
            },
            {
                name: 'app2',
                hostParent: '#app-host-container',
                hostClass: 'thy-layout',
                routerPathPrefix: '/app2',
                preload: true,
                entry: {
                  basePath: "/static/app1/"
                  manifest: "index.html"
                  scripts: [
                    'main.js'
                  ],
                  styles: [
                    'styles.css'
                  ]
                }
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

### 3. Sub App define how to bootstrap

for NgModule application:
```ts
defineApplication('app1', {
    template: `<app1-root class="app1-root"></app1-root>`,
    bootstrap: (portalApp: PlanetPortalApplication) => {
        return platformBrowserDynamic([
            {
                provide: PlanetPortalApplication,
                useValue: portalApp
            },
            {
                provide: AppRootContext,
                useValue: portalApp.data.appRootContext
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
    }
});
```

for Standalone application: (>= 17.0.0)

```ts
defineApplication('standalone-app', {
    template: `<standalone-app-root></standalone-app-root>`,
    bootstrap: (portalApp: PlanetPortalApplication) => {
        return bootstrapApplication(AppRootComponent, {
            providers: [
                {
                    provide: PlanetPortalApplication,
                    useValue: portalApp
                },
                {
                    provide: AppRootContext,
                    useValue: portalApp.data.appRootContext
                }
            ]
        }).catch(error => {
            console.error(error);
            return null;
        });
    }
});
```

## Documents

### Sub app configurations

| Name  | Type  | Description   | 中文描述   |
| ------- | -------- | ----------| -------------- |
| name      | string  | Application's name   | 子应用的名字  |
| routerPathPrefix   | string   | Application route path prefix | 子应用路由路径前缀，根据这个匹配应用 |
| selector           | string                | selector of app root component  | 子应用的启动组件选择器，因为子应用是主应用动态加载的，所以主应用需要先创建这个选择器节点，再启动 AppModule  |
| entry    | string \| PlanetApplicationEntry   | entry for micro app, contains manifest, scripts, styles | 入口配置，如果是字符串表示应用入口 index.html，如果是对象, manifest 为入口 html 或者 json 文件地址，scripts 和 styles 为指定的资源列表，未指定使用 manifest 接口中返回的所有资源，basePath 为基本路由，所有的资源请求地址前会带上 basePath  |
| manifest    | string   | manifest json file path `deprecated` please use entry | manifest.json 文件路径地址，当设置了路径后会先加载这个文件，然后根据 scripts 和 styles 文件名去找到匹配的文件，因为生产环境的静态资文件是 hash 之后的命名，需要动态获取 |
| scripts     | string[]     | javascript static resource paths `deprecated` please use entry.scripts  | JS 静态资源文件访问地址  |
| styles      | string[]     | style static resource paths `deprecated` please use entry.styles  | 样式静态资源文件访问地址  |
| resourcePathPrefix | string | path prefix of scripts and styles `deprecated` please use entry.basePath | 脚本和样式文件路径前缀，多个脚本可以避免重复写同样的前缀  |
| hostParent | string or HTMLElement | parent element for render | 应用渲染的容器元素, 指定子应用显示在哪个元素内部 |
| hostClass | string | added class for host which is selector | 宿主元素的 Class，也就是在子应用启动组件上追加的样式 |
| switchMode   | default or coexist  | it will be destroyed when set to default, it only hide app when set to coexist | 切换子应用的模式，默认切换会销毁，设置 coexist 后只会隐藏 |
| preload  | boolean   | start preload or not  | 是否启用预加载，启动后刷新页面等当前页面的应用渲染完毕后预加载子应用 |
| loadSerial   | boolean | serial load scripts                                                            | 是否串行加载脚本静态资源  |

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
        this.planetComponentLoader.register([App1ProjectListComponent]);
    }
}
```

Load `app1-project-list` (selector) component of app1 in other app via `PlanetComponentOutlet`

```html
<ng-container *planetComponentOutlet="'app1-project-list'; app: 'app1'; initialState: { search: 'xxx' }"></ng-container>

// or 
<ng-container planetComponentOutlet="app1-project-list"
              planetComponentOutletApp="app1"
              [planetComponentOutletInitialState]="{ term: 'xxx' }"
              (planetComponentLoaded)="planetComponentLoaded($event)">
</ng-container>
```

Load `app1-project-list` component of app1 in other app via `PlanetComponentLoader`, must be call `dispose`

```ts
@Component({
  ...
})
export class OneComponent {
    private componentRef: PlanetComponentRef;

    constructor(private planetComponentLoader: PlanetComponentLoader) {
    }

    openDetail() {
        this.planetComponentLoader.load('app1', 'app1-project-list', {
            container: this.containerElementRef,
            initialState: {}
        }).subscribe((componentRef) => { 
            this.componentRef = componentRef;
        });
    }

    ngOnDestroy() {
       this.componentRef?.dispose();
    }
}
```

## FAQ

### infinite loop load portal app's js
Because the portal app and sub app are packaged through webpack, there will be conflicts in module dependent files, we should set up additional config `runtimeChunk` through `@angular-builders/custom-webpack`, we expect webpack 5 to support micro frontend better.
```
// extra-webpack.config.js
{    
    optimization: {
        runtimeChunk: false
    }
};
```

### throw error `Cannot read property 'call' of undefined at __webpack_require__ (bootstrap:79)`
Similar to the reasons above, we should set `vendorChunk` as `false` for `build` and `serve` in `angular.json`

```
 ...
 "build": {
    "builder": "@angular-builders/custom-webpack:browser",
    "options": {
          "customWebpackConfig": {
              "path": "./examples/app2/extra-webpack.config.js",
              "mergeStrategies": {
                "module.rules": "prepend"
              },
              "replaceDuplicatePlugins": true
          },
          ...
          "vendorChunk": false,
          ...
      },
  },
  "serve": {
      "builder": "@angular-builders/custom-webpack:dev-server",
      "options": {
          ...
          "vendorChunk": false
          ...
      }
  }
...
```

### throw error `An accessor cannot be declared in an ambient context.`
this is TypeScript's issue, details see [an-accessor-cannot-be-declared](https://stackoverflow.com/questions/61248058/error-ngx-daterangepicker-material-an-accessor-cannot-be-declared-in-an-ambient
)
should setting `skipLibCheck` as true 
```
"compilerOptions": {
    "skipLibCheck": true
}
```

### Production env throw error `Cannot read property 'call' of undefined` use router lazy load

In webpack 4 multiple webpack runtimes could conflict on the same HTML page, because they use the same global variable for chunk loading. To fix that it was needed to provide a custom name to the output.jsonpFunction configuration, details see [Automatic unique naming](https://webpack.js.org/blog/2020-10-10-webpack-5-release/#automatic-unique-naming).

you should set a unique name for each sub application in `extra-webpack.config.js`
```
output: { jsonpFunction: "app1" }
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
    <td align="center"><a href="https://www.zhihu.com/people/why520crazy/activities"><img src="https://avatars2.githubusercontent.com/u/3959960?v=4" width="100px;" alt=""/><br /><sub><b>why520crazy</b></sub></a><br /><a href="#question-why520crazy" title="Answering Questions">💬</a> <a href="#business-why520crazy" title="Business development">💼</a> <a href="https://github.com/worktile/ngx-planet/commits?author=why520crazy" title="Code">💻</a> <a href="#design-why520crazy" title="Design">🎨</a> <a href="https://github.com/worktile/ngx-planet/commits?author=why520crazy" title="Documentation">📖</a> <a href="#eventOrganizing-why520crazy" title="Event Organizing">📋</a> <a href="#infra-why520crazy" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-why520crazy" title="Maintenance">🚧</a> <a href="#projectManagement-why520crazy" title="Project Management">📆</a> <a href="https://github.com/worktile/ngx-planet/pulls?q=is%3Apr+reviewed-by%3Awhy520crazy" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/walkerkay"><img src="https://avatars1.githubusercontent.com/u/15701592?v=4" width="100px;" alt=""/><br /><sub><b>Walker</b></sub></a><br /><a href="https://github.com/worktile/ngx-planet/commits?author=walkerkay" title="Code">💻</a> <a href="#example-walkerkay" title="Examples">💡</a> <a href="#maintenance-walkerkay" title="Maintenance">🚧</a> <a href="https://github.com/worktile/ngx-planet/pulls?q=is%3Apr+reviewed-by%3Awalkerkay" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://whyour.cn"><img src="https://avatars3.githubusercontent.com/u/22700758?v=4" width="100px;" alt=""/><br /><sub><b>whyour</b></sub></a><br /><a href="https://github.com/worktile/ngx-planet/commits?author=whyour" title="Code">💻</a></td>
    <td align="center"><a href="http://www.231jx.cn"><img src="https://avatars0.githubusercontent.com/u/19969080?v=4" width="100px;" alt=""/><br /><sub><b>张威</b></sub></a><br /><a href="https://github.com/worktile/ngx-planet/commits?author=aoilti" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/luxiaobei"><img src="https://avatars1.githubusercontent.com/u/13583957?v=4" width="100px;" alt=""/><br /><sub><b>luxiaobei</b></sub></a><br /><a href="#infra-luxiaobei" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/worktile/ngx-planet/commits?author=luxiaobei" title="Tests">⚠️</a> <a href="https://github.com/worktile/ngx-planet/commits?author=luxiaobei" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mario56"><img src="https://avatars2.githubusercontent.com/u/7720722?v=4" width="100px;" alt=""/><br /><sub><b>mario_ma</b></sub></a><br /><a href="https://github.com/worktile/ngx-planet/commits?author=mario56" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## LICENSE

[MIT License](https://github.com/worktile/ngx-planet/blob/master/LICENSE)
