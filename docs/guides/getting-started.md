---
title: 快速上手
order: 30
---

Planet 是一个主从架构下的微前端框架，主应用又可以叫宿主应用，我们称之为`Portal`，子应用又叫微应用，Micro App
- Portal: 负责注册、加载、启动、卸载微应用等所有管理工作
- Micro App: 微应用被主应用加载后启动

## 主应用

主应用必须是 Angular 应用（可以通过 https://angular.cn/cli 快速创建一个主应用）

### 安装包

```bash
$ npm i @worktile/planet --save
// or
$ yarn add @worktile/planet
```

### 在主应用中导入模块

目前 Planet 内置了`EmptyComponent`和`PlanetComponentOutlet`组件，如需使用需要导入`NgxPlanetModule`

```ts
import { NgxPlanetModule } from '@worktile/planet';

@NgModule({
  imports: [
    ...
    NgxPlanetModule
  ]
})
class AppModule {}
```

独立应用无需导入`NgxPlanetModule`，可以单独导入`EmptyComponent`和`PlanetComponentOutlet`组件。


### 在主应用中注册子应用

我们需要在主应用的根组件或者模块中，将子应用通过`Planet`服务注册到微前端框架中。注册时，需配置应用的的名称、应用将要渲染的父节点、路由前缀、入口等信息，运行时，会根据当前的`URL`匹配到对应的子应用，加载应用的静态资源并启动子应用。

注册子应用配置如下：

```ts
@Component({
  ...
})
class AppComponent {
  private planet = inject(Planet);
  
  ngOnInit() {
    this.planet.registerApps([
        {
            name: 'app1',
            hostParent: '#app-host-container',
            routerPathPrefix: '/app1',
            entry: "static/app1/index.html"
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
}

```

`planet.start()` 函数主要启动监听路由变化，根据当前路由找到需要激活的子应用，加载样式和脚本静态资源，并启动子应用展示在配置的`hostParent`元素容器内。

### 在主应用路由中添加子应用路由
主应用和子应用都是独立的 Angular 应用，在进入到子应用的路由时如果主应用路由发现不匹配会报错，所以需要在主应用中添加子应用路由配置，指向`EmptyComponent`。

```ts
const routes: Routes = [
    ...
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
```

## 子应用

首先有一个 Angular 子应用（可以通过 https://angular.cn/cli 快速创建应用）

### 安装包

```bash
$ npm i @worktile/planet --save
// or
$ yarn add @worktile/planet
```

### 定义子应用

在微前端架构下，子应用的启动是由主应用调用的，所以需要修改`main.ts`入口启动文件，使用`defineApplication`定义元数据和启动函数。
模块应用定义子应用：
```ts
defineApplication('app1', {
    template: `<app1-root class="app1-root"></app1-root>`,
    bootstrap: (portalApp: PlanetPortalApplication) => {
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
    }
});
```
独立应用定义子应用：(>= 17.0.0)
```ts
defineApplication('standalone-app', {
    template: `<standalone-app-root></standalone-app-root>`,
    bootstrap: (portalApp: PlanetPortalApplication) => {
        return bootstrapApplication(AppRootComponent, {
            providers: [
                {
                    provide: PlanetPortalApplication,
                    useValue: portalApp
                }
            ]
        }).catch(error => {
            console.error(error);
            return null;
        });
    }
});
```

<alert>注意：template 配置需要和子应用根组件的选择器保持一致，providers 为子应用的根供应商，添加 PlanetPortalApplication 为了方便在子应用中成功注入 PlanetPortalApplication 调用主应用的函数。</alert>

### 去除 polyfills
因为主应用已经加载了 `polyfills.ts`中的`Zone.js`了，无特殊情况子应用可以彻底去掉`angular.json`中的
`polyfills": ["zone.js"]`。

### 修改路由配置

每个子应用的根路由需要和主应用中注册的`routerPathPrefix`保持一致。
可以全局提供`APP_BASE_HREF`为`/app1`：

```ts
{
  provide: APP_BASE_HREF,
  useValue: '/app1'
},
```
或者通过设置一个`path`为`app1`的虚拟根路由：
```ts
{
  path: 'app1',
  children: [
    {
      path: '',
      component: HomeComponent
    }
 ]
}
```

