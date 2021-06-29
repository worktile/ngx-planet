---
title: Planet
path: planet
order: 10
---

## setOptions(options)
### 参数
  - options - `Partial<PlanetOptions>` - 必填

### 类型
#### PlanetOptions
- errorHandler: (error: Error) => void;
  <br>必填，
- switchMode?: SwitchModes;
  <br>可选，子应用的名称，子应用之间必须确保唯一

#### 示例
``` ts
constructor(
    private planet: Planet
) { }

ngOnInit() {
    this.planet.setOptions({
        switchMode: SwitchModes.coexist,
        errorHandler: error => {
            console.error(`Failed to load resource, error:`, error);
        }
    });
}
```

## registerApps(apps)
注册子应用的基础配置信息。当浏览器 url 发生变化时，会自动检查每一个子应用注册的 activeRule 规则，符合规则的应用将会被自动激活。
### 参数
  - apps - `PlanetApplication<TExtra>[]` - 必填，子应用的注册信息

### 类型
#### PlanetApplication
- name: string
  <br>必填，子应用的名称
- hostParent: string | HTMLElement;
  <br>必填，应用渲染的容器元素, 指定子应用显示在哪个元素内部
- routerPathPrefix: string | RegExp;
  <br>必填，子应用路由路径前缀，根据这个匹配应用
- hostClass?: string | string[];
  <br>可选，宿主元素的 Class，也就是在子应用启动组件上追加的样式
- preload?: boolean;
  <br>可选，是否启用预加载，启动后刷新页面等当前页面的应用渲染完毕后预加载子应用
- switchMode?: SwitchModes;
  <br>可选，切换子应用的模式，默认切换会销毁，设置 coexist 后只会隐藏
- resourcePathPrefix?: string;
  <br>可选，脚本和样式文件路径前缀，多个脚本可以避免重复写同样的前缀
- stylePrefix?: string;
  <br>可选，样式前缀
- styles?: string[];
  <br>可选，样式静态资源文件访问地址
- scripts?: string[];
  <br>可选，JS 静态资源文件访问地址
- loadSerial?: boolean;
  <br>可选，是否串行加载脚本静态资源
- themeStylesPath?: string;
  <br>可选，皮肤样式的路径
- manifest?: string;
  <br>可选，manifest.json 文件路径地址，当设置了路径后会先加载这个文件，然后根据 scripts 和 styles 文件名去找到匹配的文件，因为生产环境的静态资文件是 hash 之后的命名，需要动态获取
- extra: TExtra;
  <br>可选，附加数据，主要应用于业务，比如图标，子应用的颜色，显示名等个性化配置

### 示例

``` ts
constructor(
    private planet: Planet,
) { }

ngOnInit() {
    this.planet.registerApps([
        {
            name: 'app1',
            hostParent: '#app-host-container',
            routerPathPrefix: '/app1',
            selector: 'app1-root',
            scripts: ['/static/app1/main.js'],
            styles: ['/static/app1/styles.css']
        },
        // ...
    ]);
}
```

## registerApp(app)
注册子应用的基础配置信息。
### 参数
  - app - `PlanetApplication<TExtra>` - 必填，子应用的注册信息

## unregisterApp(name)
取消注册子应用。
### 参数
  - name - string - 必填，子应用名称

## getApps()
获取所有注册的子应用列表。

## start()
启动微前端框架

### 示例
``` ts
constructor(
    private planet: Planet
) {}

ngOnInit() {
    this.planet.start();
}
```
