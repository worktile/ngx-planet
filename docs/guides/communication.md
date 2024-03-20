---
title: 数据共享与通信
order: 50
---

对于主从架构的微前端来说，通常全局加载用户信息会在主应用完成，对于子应用来说无需再次获取全局数据，可以直接使用主应用加载后的数据。

## 定义全局服务

比如在主应用有一个`AppGlobalContext`全局服务存储了当前用户信息`me`，伪代码如下：

```ts
interface User {
    name: string;
    logged_at: Date;
}
@Injectable({
    providedIn: 'root'
})
export class AppGlobalContext {
    me = signal<User>({
        name: 'why520crazy',
        logged_at: new Date()
    });

    setMe() {
        this.me.set({
            name: 'why520crazy',
            logged_at: new Date()
        });
    }
}
```
<alert>注意：实际应用中会在应用初始化时调用 REST API 获取当前用户信息，此处简化为同步，只是为了示意好理解。</alert>

## 主应用设置共享数据

在主应用中通过`planet.setPortalAppData`函数设置主应用的共享数据，把主应用的`AppGlobalContext`实例赋值给`appGlobalContext`:
```ts
this.planet.setPortalAppData({
    appGlobalContext: inject(AppGlobalContext)
});
```

## 子应用获取共享数据

子应用定义应用时 [defineApplication](api/define-application) 启动函数的参数会把`PlanetPortalApplication`传递给子应用，建议子应用通过 Provider 设置到子应用的根注入器中：
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
这样子应用在任何组件和服务中都可以注入`PlanetPortalApplication`，然后通过`data`属性获取到主应用设置的共享数据，那么即获取到了主应用的`appGlobalContext`

```ts
export class HomeComponent {
    planetPortalApplication = inject(PlanetPortalApplication);

    appGlobalContext = this.planetPortalApplication.data.appGlobalContext;
}
```

## 单独提供 AppGlobalContext
通过`planetPortalApplication.data.appGlobalContext`获取数据比较繁琐，为了保持子应用和主应用使用`AppGlobalContext`的一致性，我们可以单独给`AppGlobalContext`设置`Provider`：

```ts
 providers: [
  {
    provide: PlanetPortalApplication,
    useValue: portalApp
  },
  {
    provide: AppGlobalContext,
    useValue: portalApp.data.appGlobalContext
  }
]
```

这样子应用在任何组件和服务中都可以注入`AppGlobalContext`使用：

```ts
export class HomeComponent {
    appGlobalContext = inject(AppGlobalContext);
}
```

<alert>注意：如果主应用和子应用是独立仓储，那么需要把`AppGlobalContext`抽取到业务基础库中，方便做类型复用。</alert>

## 应用通信

在实际的应用中，会经常需要主子应用之间互相通信，为了简化使用，Planet 内置了`GlobalEventDispatcher`服务实现了应用间通信，比如要在 App1 中打开 App2 的用户详情页。

### 订阅事件
首先需要在 App2 启动根组件或者模块中通过`register`注册一个`open-app2-user-detail`事件:

```ts
import { GlobalEventDispatcher } from "@worktile/planet";

class AppComponent {
  globalEventDispatcher = inject(GlobalEventDispatcher);

  constructor() {
     this.globalEventDispatcher.register('open-app2-user-detail').subscribe(event => {
        // ThyDialog.open(event.payload.uid)
     });
  }
}
```

### 派发事件

在 App1 中通过`dispatch`派发一个事件：
```ts
import { GlobalEventDispatcher } from "@worktile/planet";

class App1Component {
  globalEventDispatcher = inject(GlobalEventDispatcher);

  openUserOfApp2() {
    this.globalEventDispatcher.dispatch('open-app2-user-detail', {
        uid: "123"
     });
  }
}
```

更多 API 参数参考：[GlobalEventDispatcher](api/global-event-dispatcher)
