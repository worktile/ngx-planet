---
title: defineApplication
order: 20
toc: false
---

## defineApplication(name, options)
- 参数
  - `name：string` - 必填，子应用名称
  - `options: BootstrapOptions` - 必填，子应用启动函数以及配置信息
- 类型 BootstrapOptions
  - `template: string` - 必填，子应用的根组件模板，例如: `<app1-root></app1-root>`
  - `bootstrap: (portalApp?: PlanetPortalApplication) => Promise<NgModuleRef | ApplicationRef>` - 必填，子应用的启动函数，支持模块应用启动和独立应用，启动函数会把主应用通过参数传递给启动函数，可以在子应用中设置 Provider 方便通过依赖注入获取
- 示例
  - 模块应用
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
  - 独立应用
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
