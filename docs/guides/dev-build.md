---
title: 开发与构建
order: 40
---

在 Angular 单体应用中，本地开发使用 CLI 运行`@angular-devkit/build-angular:dev-server`构建器启动本地开发服务器，部署时通过 CLI 内置的 `ng build` 构建，把`dist`构建输出文件部署到`nginx`服务器，CLI 已经帮开发者处理了本地开发和部署构建等一系列问题。

那么在微前端架构下，因为存在多个独立的 Angular 应用，甚至还是跨仓储多团队分别维护的，那么本地开发和生成环境部署会相对复杂一些，本地开发分"独立端口访问"和"使用代理访问"。


## 独立端口访问

主应用和子应用的本地开发代理服务器使用不同的端口访问，这样注册子应用时无需加路径区分子产品，因为端口号就代表了某个子产品，如：
- 主应用(Portal)启动端口是`3000`，访问地址为：`http://127.0.0.1:3000`
- App1 本地启动端口是`3001`，访问地址为：`http://127.0.0.1:3001`
- App2 本地启动端口是`3002`，访问地址为：`http://127.0.0.1:3002`

注册子应用代码为：
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
            manifest: 'index.html',
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
`entry`同时支持字符串和对象配置，了解更多参考：[PlanetApplication.entry](api/planet#registerapp(app))

如果本地开发采用不同的端口，生产环境部署却是在同一个域名下，那么主应用需要根据环境变量是否为本地开发和生成环境配置不同的`entry`地址：

```ts
this.planet.registerApps([
    {
        name: 'app1',
        hostParent: '#app-host-container',
        routerPathPrefix: '/app1',
        entry: environment.production ? 'static/app1/index.html' : 'http://127.0.0.1:3001/index.html',
        switchMode: SwitchModes.coexist,
        preload: true,
        extra: {
            name: '应用1',
            color: '#ffa415'
        }
    }
]);
```

这里的访问地址需要根据部署环境的差异设置，子产品的静态资源包含两部分`index.html`和其他资源(脚本、样式、图片、字体等)，除了`index.html`外其他静态资源可能会部署在独立的 CDN 中。

## 使用代理访问

另外一种本地开发的方式就是主应用通过代理配置每个子产品的访问路径。

### 主应用配置代理
修改`angular.json`中的`serve.options.proxyConfig`配置一个代理文件`proxy.conf.js`
```
{
  ...
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "proxyConfig": "./proxy.conf.js"
    }
}
```

修改`proxy.conf.js`为：

```js
const PROXY_CONFIG = {};

PROXY_CONFIG['/static/app1'] = {
    target: 'http://localhost:3001',
    secure: false,
    changeOrigin: false
};

PROXY_CONFIG['/static/app2'] = {
    target: 'http://localhost:3002',
    secure: false,
    changeOrigin: true
};

module.exports = PROXY_CONFIG;
```

这里通过`static/{appName}`区分每个应用静态资源的访问路径，避免出现冲突，采用代理启动本地开发服务器时都是通过主应用的端口访问子应用资源：
- `http://127.0.0.1:3000/static/app1/*` App1 的静态资源路径
- `http://127.0.0.1:3000/static/app2/*` App2 的静态资源路径
- `http://127.0.0.1:3000/*` 主应用的静态资源路径

### 注册应用
注册应用的`entry`直接配置为代理的静态资源路径，比如：
```ts
this.planet.registerApps([
    {
        name: 'app1',
        hostParent: '#app-host-container',
        routerPathPrefix: '/app1',
        entry: 'static/app1/index.html',
        switchMode: SwitchModes.coexist,
        preload: true,
        extra: {
            name: '应用1',
            color: '#ffa415'
        }
    }
]);
```
当使用代理注册为`static/app1/index.html`时推荐生产环境部署也遵循同样的路径规则，这样不管是在本地开发还是生产环境，子产品的资源路径都是`static/app1/*`

### 子应用启动

使用代理配置了一个固定的路径`static/app1/*`访问某个子应用，子应用本地启动需要设置`serve-path=static/app1/`，否则本地访问失败。

```json
{
  "name": "app1",
  "scripts": {
    "start": "ng serve --port 3001 --serve-path=static/app1/",
    ...
  }
}
```

## ESBuild

Angular 从 17 版本开始，默认采用了 Vite 和 ESBuild 构建，如果主应用和子应用需要使用 ESBuild 插件和自定义配置，可以通过 [@angular-builders/custom-esbuild](https://github.com/just-jeb/angular-builders/tree/master/packages/custom-esbuild) 构建器实现。

### 安装包
```
npm i -D @angular-builders/custom-esbuild
```

### 修改 `angular.json`

通过 plugins 设置插件和`index.html`转换器。
```json
"architect": {
  ...
  "build": {
    "builder": "@angular-builders/custom-esbuild:application",
    "options": {
      "plugins": ["./esbuild/plugins.ts", "./esbuild/plugin-2.js"],
      "indexHtmlTransformer": "./esbuild/index-html-transformer.js",
      "outputPath": "dist/my-cool-client",
      "index": "src/index.html",
      "browser": "src/main.ts",
      "polyfills": ["zone.js"],
      "tsConfig": "src/tsconfig.app.json"
    }
  }
}
```
## Webpack

如果主应用和子应用都采用 Webpack 构建器，可以通过 [@angular-builders/custom-webpack](https://github.com/just-jeb/angular-builders/tree/master/packages/custom-webpack) 构建器实现 Webpack 自定义配置。

### 安装包
```
npm i -D @angular-builders/custom-webpack
```

### 修改 `angular.json`
通过`customWebpackConfig`配置额外的 Webpack 配置文件
```json
"architect": {
  ...
  "build": {
    "builder": "@angular-builders/custom-webpack:browser",
    "options": {
      "customWebpackConfig": {
         "path": "./extra-webpack.config.js"
      },
      ...
    }
  },
  "serve": {
    "builder": "@angular-builders/custom-webpack:dev-server",
    "options": {
      "browserTarget": "my-project:build"
    }
  }
```

### 新增 `extra-webpack.config.js`

如果注册应用`entry.manifest`或者`manifest`配置的为`assets-manifest.json`文件，那么需要通过`webpack-assets-manifest`插件单独生成`assets-manifest.json`，这里推荐配置为`index.html`，这样减少插件的安装。
```js
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = {
    output: {
        publicPath: '/static/app2/'
    },
    plugins: [new WebpackAssetsManifest()],
};
```

### 注意事项
如果子产品注册的时候 scripts 配置了相关脚本，那么只会加载配置的脚本，例如只设置了`["main.js"]`，那么需要修改`extra-webpack.config.js`设置`runtimeChunk: false`，这样就不会生成`runtime.js`文件：
```js
optimization: {
   runtimeChunk: false
}
```
否则需要把`runtime.js`加入到`scripts`配置中：
```js
this.planet.registerApps([{
  name: "app1",
  ...
  scripts: ["runtime.js", "main.js"]
}]);
```

`angular.json`中的`vendorChunk`配置也是如此，当设置为`true`时需要把`vendor.js`加入到`scripts`配置中：

```js
this.planet.registerApps([{
  name: "app1",
  ...
  scripts: ["vendor.js", "main.js"]
}]);
```

推荐使用`index.html`作为`entry`的`manifest`入口文件，`scripts`无需设置，这个会加载`index.html`输出的所有 script 标签脚本文件。
