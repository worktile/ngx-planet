---
title: Planet
path: planet
order: 10
toc: "menu"
---

```ts
import { Planet } from "@worktile/planet";

@Component({ })
class AppComponent {
  planet = inject(Planet);
}
```

## setOptions(options)
- 参数
  - options - `Partial<PlanetOptions>` - 必填
- 类型`PlanetOptions`
  - `errorHandler: (error: Error) => void;` - 必填，错误处理函数
  - `switchMode?: SwitchModes;` - 可选，切换模式
- 示例
```ts
this.planet.setOptions({
  switchMode: SwitchModes.coexist,
  errorHandler: error => {
    console.error(`Failed to load resource, error:`, error);
  }
});
```

## registerApp(app)
注册子应用的基础配置信息。当浏览器 url 发生变化时，会自动检查是否匹配到子应用注册的`routerPathPrefix`，匹配成功的应用将会被自动激活。

- 参数
  - app - `PlanetApplication<TExtra>` - 必填，子应用的注册信息
- 类型 `PlanetApplication<TExtra>`
  - `name: string` - 必填，子应用的名称
  - `hostParent: string | HTMLElement` - 必填，子应用根组件渲染的父容器元素，支持选择器和 HTMLElement;
  - `routerPathPrefix: string | RegExp` - 必填，子应用路由路径前缀，根据此配置匹配应用
  - `hostClass?: string | string[]` - 可选，宿主元素的 Class，也就是在子应用启动组件上追加的样式
  - `preload?: boolean` - 可选，是否启用预加载，启动后刷新页面等当前页面的应用渲染完毕后预加载子应用
  - `switchMode?: SwitchModes` - 可选，切换子应用的模式，默认切换会销毁，设置并存模式(coexist)后只会隐藏
  - `stylePrefix?: string` - 可选，样式前缀
  - `entry: string | PlanetApplicationEntry` - 可选，子应用的入口配置 (>=17.0.0)
    - 当配置为字符串时为子应用的入口 html 地址，例如：`http://127.0.0.1:3001/index.html`
    - 当配置为对象时`manifest`为子应用的入口 html 或者 manifest.json 地址，取代如下废弃的四个配置
    - `entry.manifest: string` -  可选，manifest.json 或者 index.html 文件路径地址
    - `entry.scripts?: string[]` - 可选，脚本静态资源文件
    - `entry.styles?: string[]` - 可选，样式静态资源文件
    - `entry.basePath?: string[]`  - 可选，脚本和样式文件路径前缀，多个脚本可以避免重复写同样的前缀，此配置对于 manifest 不生效，主要是因为 manifest 和脚本样式资源文件在生产环境下一般地址不同，manifest 通常存放在服务器上，脚本样式资源文件存在于 CDN 上
  - [`废弃`]`resourcePathPrefix?: string` - 可选，脚本和样式文件路径前缀，多个脚本可以避免重复写同样的前缀
  - [`废弃`]`styles?: string[]` - 可选，样式静态资源文件
  - [`废弃`]`scripts?: string[]` - 可选，脚本静态资源文件
  - [`废弃`]`manifest?: string;` - 可选，manifest.json 文件路径地址，当设置了路径后会先加载这个文件，然后根据 scripts 和 styles 文件名去找到匹配的文件，因为生产环境的静态资文件是 hash 之后的命名，需要动态获取
  - `loadSerial?: boolean` - 可选，是否串行加载脚本静态资源
  - `sandbox?: boolean` - 可选，是否启用沙箱隔离
  - `themeStylesPath?: string` - 可选，皮肤样式的路径
  - `extra: TExtra` - 可选，附加数据，主要应用于业务，比如图标，子应用的颜色，显示名等个性化配置
- 示例
```ts
this.planet.registerApp({
    name: 'app1',
    hostParent: '#app-host-container',
    routerPathPrefix: '/app1',
    entry: 'http://127.0.0.1:3001/index.html',
    switchMode: SwitchModes.coexist,
    preload: true,
    extra: {
        name: '应用1',
        color: '#ffa415'
    }
});
```

## registerApps(apps)
注册多个子应用，和`registerApp`不同的是传递数组。
- 参数
  - apps - `PlanetApplication<TExtra>[]` - 必填，子应用的注册信息
- 类型
  - `PlanetApplication[]` - 必填，参考`PlanetApplication<TExtra>`
- 示例

```ts
this.planet.registerApps([
    {
        name: 'app1',
        hostParent: '#app-host-container',
        routerPathPrefix: '/app1',
        entry: 'http://127.0.0.1:3001/index.html',
        switchMode: SwitchModes.coexist,
        preload: true,
        extra: {
            name: '应用1',
            color: '#ffa415'
        }
    },
    {
        name: 'app2',
        hostParent: '#app-host-container',
        routerPathPrefix: '/app2',
        entry: {
            basePath: 'http://127.0.0.1:3002',
            manifest: 'http://127.0.0.1:3002/index.html',
            scripts: ['main.js'],
            styles: ['main.css']
        },
        switchMode: SwitchModes.coexist,
        preload: true,
        extra: {
            name: '应用2',
            color: '#ffa415'
        }
    }
]);
```

## unregisterApp(name)
取消注册子应用。
- 参数 `name - string` - 必填，子应用名称
- 示例
```ts
this.planet.unregisterApp("app1");
```

## start()
启动微前端框架，启动后会监听路由变化，根据当前 URL 在已注册的子应用中查找匹配的路由前缀，匹配成功后加载子应用的入口文件，解析脚本和样式加载并启动应用

- 示例
``` ts
this.planet.start();
```

## setPortalAppData(data)
设置主应用携带数据，方便传递给子应用，一般用于主子应用数据共享。
- 参数 `data: T` - 必填，主应用数据
- 示例
```ts
this.planet.setPortalAppData({
 appRootContext: this.appRootContext
});
```

## getApps()
获取所有注册的子应用列表。
- 返回参数
  - `PlanetApplication<TExtra>[]` 注册的子应用信息

## loading
是否有子应用在加载中
- 类型：Signal<boolean>

## appStatusChange
子应用状态修改事件
- 类型：`Observable<AppStatusChangeEvent>`
- 类型：`AppStatusChangeEvent`
  - `app: PlanetApplication` 子应用
  - `status: ApplicationStatus` 子应用的状态

```ts
this.planet.appStatusChange.subscribe({
  next: (event) => {
    // do somethings
  }
});
```
