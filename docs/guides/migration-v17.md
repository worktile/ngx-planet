---
title: v17 升级指南
order: 1000
---

## 开始之前
- 首先确保你 `Node.js >= 18.10.0`
- 创建新的分支进行升级，或者把当前分支备份

## 开始升级
- 执行`ng update @worktile/planet`命令自动升级
- 此版本新增了`entry`参数代替之前的`manifest`, `scripts`, `styles`和`resourcePathPrefix`
```
// 旧版配置
{
  manifest: "static/app1/assets-manifest.json",
  scripts: ["main.js"],
  styles: ["styles.css"],
  resourcePathPrefix: "static/app1"
}
```
=> 
```
// 推荐配置
{
  entry: {
    manifest: "static/app1/assets-manifest.json",
    scripts: ["main.js"],
    styles: ["styles.css"],
    bashPath: "static/app1"
  }
}
```
- 在 17 版本中，manifest 除了可以配置`json`文件外还可以配置`index.html`，这样就不用单独使用`webpack-assets-manifest`插件生成 manifest JSON 文件，同时支持字符串简化配置
```
{
  entry: "static/app1/index.html"
}
```
这样会加载`index.html`解析所有的 scripts 和 styles 加载。
