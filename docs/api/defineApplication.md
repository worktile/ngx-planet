---
title: defineApplication
path: defineApplication
order: 20
---

## defineApplication(name, options)
### 参数
  - name：string - 必填，子应用名称
  - options：BootstrapAppModule | BootstrapOptions - 必填，子应用启动方法

### 类型
#### BootstrapAppModule
- (portalApp?: PlanetPortalApplication) => Promise<NgModuleRef<any>>;

#### BootstrapOptions
- template: string
  <br>必填，根节点模板
- bootstrap: BootstrapAppModule;
  <br>必填，启动方法
### 示例
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
