---
title: 介绍
order: 20
---

> 这篇文章其实已经准备了 11 个月了，因为虽然我们年初就开始使用 Angular 的微前端架构，但是产品一直没有正式发布，无法通过生产环境实践验证可行性，11 月 16 日我们的产品正式灰度发布，所以是时候分享一下我们在使用 Angular 微前端这条路上的心得（踩过的坑）了额，希望和 Angular 社区一起成长一起进步，如果你对微前端有一定的了解并且已经在项目中尝试了可以忽略前面的章节。

## 什么是微前端

微前端这个词这两年很频繁的出现在大家的视野中，最早提出这个概念的应该是在 ThoughtWork 的技术雷达，主要是把微服务的概念引入到了前端，让前端的多个模块或者应用解耦，做到让前端的子模块独立仓储，独立运行，独立部署。

那么微前端和微服务到底有什么区别呢？

下面这张图是微服务的示意图，微服务主要是业务模块按照一定的规则拆分，独立开发，独立部署，部署后通过 Nginx 做路由转发，微服务的难点是需要考虑多个模块之间如何调用的问题，以及鉴权，日志，甚至加入网关层

![image.png](https://wt-box.worktile.com/public/cbb87938-8aae-4f14-a3d9-e9ae0aeb2078)

对于微服务来说，模块分开解藕基本就完事了，但是微前端不一样，前端应用在运行时却是一个整体，需要聚合，甚至还需要交互，通信。

![image.png](https://wt-box.worktile.com/public/e1a8193e-8a48-4197-9612-0585e47acfaa)

## 为什么需要微前端（Micro Front-end）

1. 系统模块增多，单体应用变得臃肿，开发效率低下，构建速度变慢；
1. 人员扩大，需要多个前端团队独立开发，独立部署，如果都在一个仓储中开发会带来一些列问题；
1. 解决遗留系统，新模块需要使用最新的框架和技术，旧系统还继续使用。

## 微前端的几种方案对比

| 方式           | 描述                                                                       | 优点                                 | 缺点                                                                           | 难度系数 |
| -------------- | -------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------ | -------- |
| 路由转发       | 路由转发严格意义上不属于微前端，多个子模块之间共享一个导航即可             | 简单，易实现                         | 体验不好，切换应用整个页面刷新                                                 | 🌟       |
| 嵌套 iframe    | 每个子应用一个 iframe 嵌套                                                 | 应用之间自带沙箱隔离                 | 重复加载脚本和样式                                                             | 🌟🌟     |
| 构建时组合     | 独立仓储，独立开发，构建时整体打包，合并应用                               | 方便依赖管理，抽取公共模块           | 无法独立部署，技术栈，依赖版本必须统一                                         | 🌟🌟     |
| 运行时组合     | 每个子应用独立构建，运行时由主应用负责应用管理，加载，启动，卸载，通信机制 | 良好的体验，真正的独立开发，独立部署 | 复杂，需要设计加载，通信机制，无法做到彻底隔离，需要解决依赖冲突，样式冲突问题 | 🌟🌟🌟   |
| Web Components | 每个子应用需要使用 Web Components 技术编写组件或者使用框架生成             | 面向未来                             | 不成熟，需要踩坑                                                               | 🌟🌟🌟   |

上述只是简单列举了几种实现方式的对比，当然这些方案也不是互斥的，选择哪种方案取决你的业务场景是什么，以下几个前提条件对于技术选型至关重要：

-   是否为 SPA 单体应用？
-   技术栈是否统一，需要支持跨框架调用吗？
-   是否需要应用间彻底隔离？

我们是做企业级 SaaS 平台的，肯定是 SPA 单体应用，技术栈都是 Angular，应用之间不需要彻底隔离，反而需要共享通用样式和组件，避免重复加载。

所以选择的是：`运行时组合` 方案。

## Worktile 的微前端技术选型之路

目前市面上的微前端解决方案并不多，关注度和成熟度最高的应该就是 [single-spa](https://single-spa.js.org/)

国内也有很多团队都有自己的微前端框架，比如开源了的基于 single-spa 的 [qiankun - 可能是你见过最完善的微前端解决方案](https://zhuanlan.zhihu.com/p/78362028) , 还有 phodal 的 [mooa](https://github.com/phodal/mooa) 以及无数内部的解决方案（最近阿里飞冰也开源 了[面向大型工作台的微前端解决方案 icestark](https://zhuanlan.zhihu.com/p/88449415)，只支持 React 和 Vue）

我们在做技术选型的时候首要考虑的就是 `single-spa` 和 `mooa`, `single-spa` 成熟度应该最高，示例文档很完善，`mooa` 为 Angular 打造的主从结构的微前端框架，和我们的业务和技术符合度最高，研究一段时间后最终我们还是选择了自研一套符合自己的微前端库（因为比较简单，不敢称之为框架），主要是因为我们的业务有以下几个需求在以上的框架中不满足或者说很难满足, 甚至需要高度定制。

-   产品是主从结构的，Portal 包含左侧导航，消息通知以及子应用管理
-   需要在多个子应用之间通信，主应用或者某个子应用需要打开其他子应用的详情页或者路由跳转
-   子应用 A 的某个页面中可能会加载子应用 B 的某个组件
-   基于以上 2 个特性，所以需要提供并存模式，即当前显示的虽然是 B 应用，但是要保证 A 应用正常可以调用，如果销毁了就无法被其他应用调用
-   需要提供预加载功能
-   子应用的样式也需要独立加载
-   路由，不管是在主应用还是子应用，路由体验要和单体应用一致

我运行了 `single-spa` 和 `mooa` 的示例，主要是一些简单的渲染展示，一旦需要满足以上一些特性还是需要修改很多东西，`mooa` 实现应该还是比较全面也比较适合我们的，但是它的示例中路由有一些问题，页面跳转了但是路由没有变，打包已经抛弃了 Angular CLI，代码层面参考了 `single-spa` 的很多东西，API 可以再度简化，既然是为 Angular 定制的，我觉得应该以 Angular 的方式实现更符合，当然不排除作者想要后期支持 React 和 Vue，不可否认的是 `phodal` 本人对于微前端的理解的确很深，写的很多不错的微前端的文章 [microfrontends](https://github.com/phodal/microfrontends)， 甚至出过唯一一本微前端的书《前端架构 - 从入门到微前端》，我在实现微前端的时候也借鉴参考了它的很多思想和实现方式。

## 使用 Angular 打造微前端应用

使用 Angular 实现微前端其实比 React 和 Vue 更加困难，因为 Angular 包含 AOT 编译，Module，Zone.js ，Service 共享等等问题，React 和 Vue 直接子应用 JS 加载渲染页面某个区域即可。

#### 选择动态加载模块后编译还是加载整个应用

在 Angular 单体应用中，必须有一个根模块 AppModule，然后是每个特性模块 FeatureModule，每个特性模块可以有自己的路由，当然可以使用路由的惰性加载这些特性模块，但是在微前端架构中，每个子模块都是独立仓储的，如何在运行时把子模块加载到根模块就是一个技术选择难点。

1. 第一种方案就是把每个子模块当作一个特性模块，然后在打包的时候随着主应用一起打包编译，这样是最简单的，但是这个无法做到独立部署，而且每次部署都是全量更新
1. 第二种方案还是把子模块当作一个特性模块，在主应用通过 SystemJsNgModuleLoader 加载子模块，然后编译运行，（注：SystemJsNgModuleLoader 在新版本已经遗弃）
1. 第三种方案就是每个子模块是一个独立的应用，和主应用一样，有自己的 AppModule， 路由，选择这种方案就需要处理多个应用路由同步的问题，还有就是 Angular 目前的依赖库是无法直接运行时使用的，需要每个子应用一起编译，无法做到公共依赖库抽取（可能有其他方案）
1. 第四种方案就是把所有的子模块编译成 Web Components 使用，我暂时没有深入研究过，选择这种方案直接使用组件肯定没有问题，但是使用 Web Components 后路由如何处理我不知道。

我们最终选择了最复杂的第三种方案，因为新的 Ivy 渲染引擎正式发布后会解决第三方依赖库运行时直接使用的问题，至于 Web Components 没有深入研究，因为目前第三种方案运行挺好的。

![image.png](https://wt-box.worktile.com/public/58aee6ef-e016-431e-8588-14517230669a)

#### 应用注册，加载，销毁机制

这个是所有微前端应用的基础和核心，但是我觉得反而是最简单容易实现的，主要要做的就是：

-   提供静态资源动态加载功能
-   配置好子应用的规则，包含：应用名称，路由前缀，静态资源文件

```
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
```

-   应用加载：根据当前页面的 URL 找到对应的子应用，然后加载应用的静态资源，调用预定义好的启动函数直接启动应用即可，在 Angular 中就是启动根模块 `platformBrowserDynamic().bootstrapModule(AppModule)`。
-   应用的预加载：当前应用渲染完毕会预加载其他应用，并启动，并不会显示
-   销毁应用使用 `appModuleRef.destroy();`

按照上述的步骤处理简单的场景基本就足够了，但是如果希望应用共存就不一样了，我们的做法是把 `bootstrapped` 状态隐藏起来，而不是销毁，只有 `Active` 状态的应用才会显示在当前页面中。

#### 路由

因为选择了每个子应用是独立的 Angular 应用，同时还可以共存多个子应用，那么多个应用的路由同步，跳转就成了难题，而且还要支持应用之间路由跳转，应用之间通信，组件渲染等场景。我认为路由是我们在使用微前端架构中遇到的最复杂的问题。

目前我们的做法是主应用的路由中把所有子应用的路由都配置上，组件设置成 `EmptyComponent` , 这样在切换到子应用路由的时候，主应用会匹配空路由状态，不会报错，每个子应用需要添加一个通用的空路由 `EmptyComponent`

```
{
        path: '**',
        component: EmptyComponent
}
```

除此之外还需要在切换路由的时候同步更新其他应用的路由，否则会造成每个应用的当前路由状态不一致，切换的时候会有跳转不成功的问题。

-   主应用路由切换时，找到所有当前启动的子应用，使用 `router.navigateByUrl` 同步跳转
-   子应用路由切换时，同步主应用路由，同时同步其他启动状态的子路由

我看了很多微前端框架包括 `single-spa`，基本上路由这一块没有处理，完全交给开发者自己去填坑，`single-spa` 的 Angular 示例基本就是切换就销毁了 Angular 应用，因为没有并存，所以也就不需要处理多个应用路由的问题了，当然它作为和框架无关的微前端解决方案，也只能做到这一步了吧。

这个等 Ivy 渲染引擎正式发布后，可以把子应用编译成直接可以运行的模块，整个应用如果只有一个路由会简化很多。

#### 共享全局服务

对于一些全局的数据我们一般会存储在服务中，然后子应用可以直接共享，比如：`当前登录用户`，`多语言服务`等，简单的数据共享可以直接挂载在 window 上即可，为了让每个子应用使用全局服务和模块内服务一致，我们通过在主应用中实例化这些服务，但后在每个子应用的 AppModule 中使用 provide 重新设置主应用的 value，当然这些不需要子应用的业务开发人员自己设置，已经封装到业务组件库中全局配置好了。

```
{
  provide: AppContext,
  useValue: window.portalAppContext
}
```

#### 应用间通信

应用间通信有很多中方式，我们底层使用浏览器的 `CustomEvent` ，在这之上封装了 `GlobalEventDispatcher` 服务做通信（当然你也可以使用在 window 对象上挂载全局对象实现），场景就是某个子应用要打开另外一个子应用的详情页

```
// App1
globalEventDispatcher.dispatch('open-task-detail', { taskId: 'xxx' });

// App2
globalEventDispatcher.register('open-task-detail').subscribe((payload) => {
    // open dialog of task detail
});
```

#### 应用间组件互相调用

在我们的`敏捷开发`子产品中，一个用户故事的详情页，需要显示`测试管理`应用的关联的测试用例和测试执行情况，那么这个测试用例列表组件放在 `测试管理` 子应用是最合适的，那么用户故事详情页肯定在`敏捷开发`应用中，如何加载`测试管理`应用的某个组件就是一个问题。

这一块使用了 `Angular CDK 中的 DomPortalOutlet` 动态创建组件，并指定渲染在某个容器中，这样保证了这个动态组件的创建还是 `测试管理` 模块的，只是渲染在了其他应用中而已。

```
const portalOutlet = new DomPortalOutlet(container, componentFactoryResolver, appRef, injector);
const testCasesPortalComponent = new ComponentPortal(TestCasesComponent, null);
portalOutlet.attachComponentPortal(testCasesPortalComponent);
```

#### 工程化

使用微前端开发应用不仅仅要解决 Angular 的技术问题，还有一些开发，协作，部署等工程化的问题需要解决，比如：

-   公共依赖库抽取
-   本地如何启动开发
-   如何打包部署，生成的 hash 资源文件如何通知主应用

应用公共依赖库抽取避免类库重复打包，减少打包体积，这就需要自定义 Webpack Config 实现，起初我们是完全自定义 Webpack 打包 Angular 应用，一旦这么做就会失去很多 CLI 提供的方便功能，偶尔发现了一个类库 [angular-builders](https://github.com/just-jeb/angular-builders) ，他的作用其实就是在 Angular CLI 生成的 Webpack Config 中合并自定义的 Webpack Config，这样就做到了只需要写少量的自定义配置，其余的还是完全使用 CLI 的打包功能，差一点就要自己写一个类似的工具了。
在主应用中把需要公共依赖包放入 scripts 中，然后在子应用中配置 externals，比如：moment lodash rxjs 这样的类库。

```
const webpackExtraConfig = {
    optimization: {
        runtimeChunk: false // 子应用一定要设置 false，否则会报错
    },
    externals: {
        moment: 'moment',
        lodash: '_',
        rxjs: 'rxjs',
       'rxjs/operators': 'rxjs.operators',
        highcharts: 'Highcharts'
    },
    devtool: options.isDev ? 'eval-source-map' : '',
    plugins: [new WebpackAssetsManifest()]
};
return webpackExtraConfig;

```

WebpackAssetsManifest 主要作用是生成 `manifest.json` 文件，目的就是让生成的 Hash 文文件的对应关系，让主应用加载正确的资源文件。

本地开发配置 `proxy.conf.js` 代理访问每个子应用的资源文件，同时包括 API 调用。

## 基于 Angular 的微前端库 ngx-planet

以上是我们在使用 Angular 打造微前端应用遇到的一些技术难点和我们的解决方案，调研后最终选择自研一套符合我们业务场景的，同时只为 Angular 量身打造的微前端库。

Github 仓储地址：[ngx-planet](https://github.com/worktile/ngx-planet)
在线 Demo：http://planet.ngnice.com

不敢说 “你见过最完善的微前端解决方案” ，但至少是 Angular 社区目前我见过完全可用于生产环境的方案，API 符合 Angular Style ，国内很多大厂做微前端方案基本都忽略了 Angular 这个框架的存在，Worktile 四个研发子产品完全基于 `ngx-planet` 打造开发，经过接近一年的踩坑和实践，基本完全可用。

![image.png](https://wt-box.worktile.com/public/33072ae1-9724-4dbc-8754-3914d59c19aa)

希望 Angular 社区可以多一些微前端的解决方案，一起进步，我们的方案肯定也存在很多问题，也欢迎大家提出改进的建议和吐槽，我们也将继续在 Angular 微前端的路上继续深耕下去，如果你正在寻找 Angular 的微前端类库，不妨试试 ngx-planet。

将来会调研在 Ivy 渲染引擎下的优化和改进方案。
