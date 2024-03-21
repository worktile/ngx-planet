---
title: 跨应用渲染
order: 60
---

跨应用渲染主要是子应用 A 的某个组件可以在其他应用的某个元素中渲染并展示，Planet 提供了`PlanetComponentLoader`服务和`planetComponentOutlet`指令实现跨应用的组件渲染。

## 注册组件

在 App1 子应用的根组件或者根模块注册可以被其他应用渲染的组件：
```ts
import { PlanetComponentLoader } from "@worktile/planet";

class AppComponent {
  planetComponentLoader = inject(PlanetComponentLoader);

   constructor() {
    this.planetComponentLoader.register(ProjectsComponent);
   }
}
```

## 渲染组件

在其他应用，比如 App2 中通过`planetComponentLoader.load`渲染 App1 的`ProjectsComponent`:

```ts
const this.planetComponentLoader.load("app1", "app1-project-list", {
  container: this.elementRef,
  initialState: {
    term: "xxx"
  }
});
@Component({
  ...
})
export class OneComponent {
    private componentRef: PlanetComponentRef;
    
    private planetComponentLoader = inject(PlanetComponentLoader);

    loadProjects() {
        this.planetComponentLoader.load('app1', 'app1-project-list', {
            container: this.elementRef,
            initialState: {
              term: 'x'
            }
        }).subscribe((componentRef) => { 
            this.componentRef = componentRef;
        });
    }

    ngOnDestroy() {
       this.componentRef?.dispose();
    }
}
```
这里的第二个参数为组件的选择器，container 为组件渲染的容器元素，API 更多详情参考 [PlanetComponentLoader](api/planet-component-loader)。

<alert>注意：跨应用渲染组件后在当前组件销毁时一定要记得调用 dispose 函数销毁已经渲染的组件，否则会有性能泄露。</alert>

## 通过指令渲染组件

`planetComponentOutlet`是 Planet 提供跨应用渲染的结构性指令，无需通过`PlanetComponentLoader`手动渲染和销毁。

```html
<ng-container *planetComponentOutlet="'app1-project-list'; app: 'app1'; initialState: { term: 'x' }">
</ng-container>

// or 
<ng-container planetComponentOutlet="app1-project-list"
              planetComponentOutletApp="app1"
              [planetComponentOutletInitialState]="{ term: 'x' }"
              (planetComponentLoaded)="planetComponentLoaded($event)">
</ng-container>
```
