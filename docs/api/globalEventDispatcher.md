---
title: GlobalEventDispatcher
path: globalEventDispatcher
order: 30
---

## register(components)
注册组件，注册后的组件可在其他子应用中渲染
### 参数
  - components - PlanetComponent | PlanetComponent[] - 必填，注册的组件列表

### 类型
#### PlanetComponent
- name: string
  <br>必填，组件名称
- component: ComponentType<T>;
  <br>必填，组件

### 示例

```ts
import { GlobalEventDispatcher } from "@worktile/planet";

// app1 root module
constructor(private globalEventDispatcher: GlobalEventDispatcher) {
    this.globalEventDispatcher.register('open-a-detail').subscribe(event => {
        // dialog.open(App1DetailComponent);
    });
}
```

## dispatch((name, payload))
渲染其他应用中注册过的组件
### 参数
  - name - string - 必填，注册的组件列表
  - payload - 可选，传入组件的参数

### 示例

```ts
import { GlobalEventDispatcher } from "@worktile/planet";

// in other apps
export class OneComponent {
    constructor(private globalEventDispatcher: GlobalEventDispatcher) {}

    openDetail() {
        this.globalEventDispatcher.dispatch('open-a-detail', payload);
    }
}
```