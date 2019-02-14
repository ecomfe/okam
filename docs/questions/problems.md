# 问题集锦

!> 这里记录问题，可能随着各个小程序不断迭代升级优化，有些问题可能已被修复。

## Okam 使用问题

* 如果使用了 `Okam` 某个功能不能用，比如 Vue 数据操作方式没有生效，请确保构建配置启用了[相应扩展](/build/index?id=framework)，其次参考使用文档，确认是否自己使用方式不对。

## 支付宝小程序

* 目前支付宝开发者工具是默认支持 `ES6` 语法，但部分语法支持有点问题

    模块 a 定义：
    ```javascript
    // ./a.js
    import * as abc from 'xxx';
    export default abc; // 这种写法会导致默认导出没有成功
    // export {abc as default}; // 这样也是没法导出成功
    // export default Object.assign{{}, abc}; // 这样是 ok 的
    // export {abc}; // 不使用默认导出，这样是 ok 的
    ```

    模块 b 导入模块 a 定义：
    ```javascript
    // ./b.js
    import abc from 'a';
    // abc undefined
    ```

* 如果脚本文件内容是空的，会导致开发者工具报错

* 开发者工具有时候点击左上角返回上一级页面会报：`Cannot read property 'NBPageUrl' of undefined` ：具体原因不详，可以把开发者工具生成的 `.tea` 目录（构建出来项目目录下）删掉，退出开发者工具再进入，自己就会好了。

* 构建配置 `localPolyfill` 引入 `promise` 会导致 `IOS` 下预览出错，目前所有小程序都是默认支持 `Promise`，因此不再需要做 `promise` `polyfill`，解决办法删掉该 `promise` 配置项即可修复，具体原因不详。

* 不支持 `icon` 上绑事件

## 百度小程序

* 自定义组件中的图片路径是相对于引用页面的，这是实现问题，最新版本会在 `2019.1.3` [修复上线](https://smartprogram.baidu.com/forum/topic/show/64967)。因此对于此情况，想多平台生效，可以将路径设置为 相对于 小程序项目目录的 绝对路径，如: `'/common/img/x.png'`, 具体路径，视自己项目情况而定。

* 百度小程序非兼容性升级关注
    * [2018.11.23](https://smartprogram.baidu.com/forum/topic/show/64420)
    * [2018.12.14](https://smartprogram.baidu.com/forum/topic/show/64967)

* 字体图标 真机ios正常，安卓不正常

## 头条小程序

* `input` 原生组件 `maxlength`，不支持 -1 为无限制

* 自定义组件上挂的 `data-` 取不到

* 自定义事件 值只能是对象类型

* 自定义组件内 监听 `capture` 事件 会执行两遍, 一遍 `page` 上的同名函数，一遍 `component` 上的函数
