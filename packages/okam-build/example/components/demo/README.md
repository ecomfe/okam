Example
---

## Preparation

仅用于测试 自定义组件 npm 依赖

```shell
npm run init
```

## 构建

```shell
npm run build # 清空之前构建产物，重新构建
```

## 开发调试

```shell
npm run dev # 重新构建，并进入watch mode
npm run dev:debug
npm run dev:clean # 删除构建产物，保留 project.swan.json 并进入 watch 构建模式
```

## 注意

`min-component` 为手动编写的 npm 包 只供测试 npm 上没有 所以不要删除

`min-component.zip`  保存 用于测试，里面有两个包：`min-component, min-component2`

`npm i` 之后将  `min-component.zip` 文件 放置 `node_modules` 然后解压
