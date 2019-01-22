Example
---

## pages 中的 示例来自 iview/example

[ivew example](https://github.com/TalkingData/iview-weapp/tree/master/examples)


## Preparation

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

## ui 组件

- [iview](https://weapp.iviewui.com/docs/guide/start)

## 存在问题

- 引入了 `node_modules` 路径得组件 会导致出错，更换 路径名是 ok 的

已解决： 将 `node_modules` 替换成 `npm`

- 用到的 `getRelationNodes` 即：behaviors、组件间关系、抽象节点 百度自定义组件不支持 等
<!-- 影响: 复选框 -->

- 自定义组件样式不生效 同名的组件 有的加前缀 有的不加前缀，导致组件样式渲染失败

已解决：百度小程序已修复

- 自定义组件 样式 伪类 设置 content: 'xxx'，  xxx  为字体的代码点 时 不显示 新版本 直接显示 代码值
比如：content: '\e6de'：会直接渲染成出 `e6de`
<!-- 影响: 字体 ios 真机正常 、android 不正常 -->
- `relations` 不支持

- event detail  微信与小程序不一致
已解决：框架已做兼容处理
<!-- 影响： detail 使用方式 -->

- 里面用 `data` 上用了 `...` 了 必须 `babel7` 转

<!-- 影响： detail -->

- `wxs` 语法不一致未做处理
<!-- 影响: wxs -->
    - [wx: wxs](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxs/)
    - [swan: filter](https://smartprogram.baidu.com/docs/develop/framework/view_filter/)

## 注意

`pages` 必须包含文件夹中, 开发工具是正常的 页面是错误的

## okam todo
- 写的是 `wx` 直接转百度小程序
- `wxs` 支持
- `getRelationNodes` 支持

