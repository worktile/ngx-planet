---
title: PlanetComponentLoader
order: 30
toc: menu
---

```ts
import { PlanetComponentLoader } from "@worktile/planet";

class SomeClass {
  planetComponentLoader = inject(PlanetComponentLoader);
}
```

## register(components)
注册组件，注册后的组件可在其他子应用中渲染
- 参数
  - components - PlanetComponent | PlanetComponent[] | Type<T> | Type<T>[] - 必填，注册的组件
- 类型 `PlanetComponent`
  - `name: string` - 必填，组件名称
  - `component: Type<T>` - 必填，组件类
- 示例

```ts
this.planetComponentLoader.register(ProjectsComponent);
// =
this.planetComponentLoader.register({
  name: "project-list",
  component: ProjectsComponent
});

this.planetComponentLoader.register([ProjectsComponent, ProjectDetailComponent]);
```

## load(name, componentName, config)
渲染其他应用中注册过的组件。
- 参数
  - `name: string` - 必填，加载组件所在的应用名称，例如："app1"
  - `componentName: string` - 必填，加载组件的名称
  - `config: PlantComponentConfig<TData>` - 必填，组件参数
- 类型 `PlantComponentConfig`
  - `container: HTMLElement | ElementRef<any> | Comment` - 必填，渲染组件的容器
  - `hostClass?: string` - 可选，渲染组件的宿主样式类
  - `initialState: TData` - 可选，渲染组件的初始化状态
- 示例

```ts
this.planetComponentLoader.load("app1", "project-list", {
  container: this.elementRef,
  initialState: {
    uid: "xxx"
  }
});
```
