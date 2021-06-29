---
title: 快速上手
order: 30
---

> 我们的 [产品](https://worktile.com) 正式发布已有一段时间，验证了 ngx-planet 在生产环境的可行性。在 ngx-planet 框架开源后，不断有团队尝试使用 ngx-planet 框架的。为了让大家可以快速上手添加应用，这里给提供一些说明。

## 使用 ngx-planet 框架的应用间结构

多个应用间是主从结构，主应用为 portal，在主应用中注册、管理多个子应用 app1、app2。在运行时，首先启动主应用，子应用在运行时动态加载。那么主应用是如何注册子应用，子应用在运行时是如何启动的呢？

## 主应用

### 准备工作
首先有一个 Angular 应用我们作为 portal 主应用（可以通过 https://angular.cn/cli 快速创建应用）

### 安装 ngx-planet

```bash
$ npm i @worktile/planet --save
// or
$ yarn add @worktile/planet
```

### 在主应用中加载 NgxPlanetModule

```ts
import { NgxPlanetModule } from '@worktile/planet';

@NgModule({
  imports: [
    CommonModule,
    NgxPlanetModule
  ]
})
class AppModule {}
```

### 在主应用中注册子应用
我们需要在主应用 portal 中，将子应用通过 Planet 服务注册到微前端框架中。注册时，需配置应用的的名称、应用将要渲染的父节点、路由前缀、应用跟组件名称、静态资源文件等信息。在运行时，ngx-planet 会根据当前的 URL 找到对应的子应用，并加载应用的静态资源，启动应用。

注册子应用配置如下：

```ts
constructor(
    private planet: Planet
) {}

ngOnInit() {
    this.planet.registerApps([
        {
            name: 'app1',
            hostParent: '#app-host-container',
            hostClass: appHostClass,
            routerPathPrefix: /\/app1|app4/, // '/app1',
            selector: 'app1-root',
            resourcePathPrefix: '/static/app1/',
            preload: settings.app1.preload,
            switchMode: settings.app1.switchMode,
            loadSerial: true,
            scripts: [
                'main.js',
            ],
            styles: ['assets/main.css'],
            manifest: '/static/app1/manifest.json',
            extra: {
                name: '应用1',
                color: '#ffa415'
            }
        }
    ]);

    // start monitor route changes
    // get apps to active by current path
    // load static resources which contains javascript and css
    // bootstrap angular sub app module and show it
    this.planet.start();
}
```

### 在主应用路由中添加子应用路由
```ts
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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
```

## 子应用

### 准备工作

首先有一个 Angular 子应用（可以通过 https://angular.cn/cli 快速创建应用）

### 安装 ngx-planet

```bash
$ npm i @worktile/planet --save
// or
$ yarn add @worktile/planet
```

### 启动子应用

在 Angular 中，启动应用是以下几步：

1. 根据 angular.json 中的配置的启动脚本和启动页面
1. 根据启动脚本中的配置，启动主模块 AppModule，加载 AppModule 中其他 import 的模块并将组件渲染到页面中

```
platformBrowserDynamic()
    .bootstrapModule(AppModule)
```

1. 加载 AppModule 中其他 import 的模块
1. 将组件渲染到页面中

所以，ngx-planet 启动子应用同样需要这些步骤。ngx-planet 提供了 defineApplication 方法，我们需要在子应用中，定义如何启动子应用。当需要启动子应用的时候，ngx-planet 调用注册的方法，启动应用。

定义启动信息如下：

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

第一个参数 app1 为应用名称，名称与注册子应用时一致，第二个参数为启动应用时执行的方法。
