---
title: GlobalEventDispatcher
order: 30
---

```ts
import { GlobalEventDispatcher } from "@worktile/planet";

class SomeClass {
  globalEventDispatcher = inject(GlobalEventDispatcher);
}
```

## register(eventName)
注册事件并订阅，当其他应用派发事件时会执行回调函数。
- 参数 `eventName: string` - 必填，注册的事件名称
- 返回参数 `Observable<T>`
- 示例

```ts
 this.globalEventDispatcher.register('open-a-detail').subscribe(event => {
    // do somethings
 });
```

## dispatch(name, payload)
派发事件给所有注册且订阅相同事件名的应用。
- 参数
  - `name: string` - 必填，唯一的事件名称
  - `payload: T` - 可选，事件附带数据
- 示例

```ts
this.globalEventDispatcher.dispatch('open-a-detail', {
  from: "app2"
});
```
