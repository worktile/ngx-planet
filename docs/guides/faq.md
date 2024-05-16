---
title: 常见问题
order: 100
---

## 支持其他框架吗？

暂时不支持。

## error TS6053 '...polyfills.ngtypecheck.ts' not found.

```
Error: error TS6053: File '/Users/haifeng/IT/01_Study/ngnice/ngnice.com/src/polyfills.ngtypecheck.ts' not found.
  The file is in the program because:
    Root file specified for compilation
```

这是`tsconfig.json`中的`files`设置了`"src/polyfills.ts"`导致的，在 docgeni 新版本中 site 已经不会生成 polyfills.ts 文件了，如果过去自定义了`tsconfig.json`可能会包含，所以需要去掉：

```json
{
  "files": [
    "src/main.ts",
-   "src/polyfills.ts"
  ],
}
```