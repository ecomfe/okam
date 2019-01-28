Native components
---

## Preparation

用于展现原生组件支持示例。

```shell
npm i
npm run init
```

## 开发调试

```shell
npm run dev # 重新构建，并进入watch mode
npm run dev:debug
npm run dev:clean # 删除构建产物，保留 project.swan.json 并进入 watch 构建模式
```


## 问题点

### swan filter
Filter 文件命名方式为:模块名.filter.js;
Filter 通过 export default 方式对外暴露其内部的私有函数;
Filter 只能导出function函数;
Filter 函数不能作为组件的事件回调;
Filter 可以创建独立得模块，也可以通过内联的形式;
Filter 不支持全局变量;
多个 filter 标签不能出现相同的 src 属性值， module 属性的值也是标识模块的唯一 id 。

### wxs
wxs 不依赖于运行时的基础库版本，可以在所有版本的小程序中运行。
wxs 与 javascript 是不同的语言，有自己的语法，并不和 javascript 一致。
wxs 的运行环境和其他 javascript 代码是隔离的，wxs 中不能调用其他 javascript 文件中定义的函数，也不能调用小程序提供的API。
wxs 函数不能作为组件的事件回调。
由于运行环境的差异，在 iOS 设备上小程序内的 wxs 会比 javascript 代码快 2 ~ 20 倍。在 android 设备上二者运行效率无差异。

百度只能

```
export default {
    fn
}
```

- 支持

```
- module.exports = {};

```

- 不支持

```
    - module.exports.message = msg;
    - module.exports = fn
```
