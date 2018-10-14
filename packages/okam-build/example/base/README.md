Example
---

## Preparation

```shell
npm run init
```

**提示：** 如果有依赖更新，需要重新执行下上面命令

`example` 示例还自带其它几个命令：

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

## 使用 Babel7

如果要使用 babel7，需要在 `scripts/swan.config.js` 将对应的 `babel` 处理器名称改成 `babel7`
