# 入口定义

小程序入口脚本，命名默认遵从小程序的入口命名 `app`。

## App 脚本

* 文件路径：`src/app.js`，如果使用其它语法比如 `typescript`，可以为 `src/app.ts`

* 入口脚本定义

    * 不需要原生 `App({})` 方式进行包裹，只需要导出对应的入口脚本定义即可

    * App 上下文依旧是原生小程序上下文，因此定义同原生小程序

    * App 定义新增 `config` 配置，用来定义 App 的配置，等价于原生小程序的 `app.json` 定义

    ```javascript
    // src/app.js 定义

    export default {

        // app 配置定义，新增
        config: {
            pages: [
                'pages/home/index'
            ]
        },

        globalData: {}, // 全局应用数据定义，同原生小程序

        // 下述生命周期及事件回调同原生小程序支持
        onLaunch() {}, // 小程序初始化完成触发
        onShow() {}, // 小程序启动或从后台切到前台显示触发
        onHide() {}, // 小程序从前台切入到后台触发
        onError() {}, // 小程序脚本出错或者api调用失败触发
        onPageNotFound() {}, // 打开页面不存在触发回调

        // 自定义 function
        myFunc() {}
    };
    ```

!> `快应用` 不支持 `onShow` `onHide` `onPageNotFound` hook

## App 扩展 API

* `$api`: 挂载所有原生小程序 API，App 上下文访问：`this.$api.xxx()` 等价于 `swan.xxx()`，建议小程序都摒弃特定小程序命名空间 API 访问方式，方便以后同一套代码转成其它平台端的小程序

* ~~`$global`: 小程序提供的全局对象~~ (`0.4.0` 版本开始后废弃该字段，如果需要存放全局数据，在 app 上下文上定义 globalData，其它地方通过 `this.$app.globalData` 方式访问)

* `$http`: 封装了小程序原生 `request` 接口的 HTTP 请求接口，具体使用说明可以参考 [HTTP请求](advance/http.md)

* `$na`: `0.4.0` 版本开始新增属性，该字段主要获取全局原生的一些 API，目前主要提供如下几个接口属性：

    * `$na.getCurrApp()`: 获取当前 App 实例，`快应用` 返回的是对应的应用信息，暂无法返回对应的 app 实例
    * `$na.getCurrPages()`: 获取打开的页面实例列表，`快应用` 不支持
    * `$na.appGlobal`: app 全局对象属性
    * `$na.appEnv`: app 环境对象属性，对于百度小程序等价于 `swan`，微信小程序为 `wx`，支付宝小程序为 `my`，头条小程序 `tt`，快应用为 global 对象 即 等同于 `appGlobal`，该属性主要用在如果想访问原生的 API 定义，而不是想使用重写后的定义，可以通过该属性获取到
    * `$na.api`: app 全局 API 定义，所有小程序提供的原生 API 都可以通过该属性访问到，但原生 API 可能会被重写掉，比如支付宝的 `showToast` API 定义跟微信小程序不一致，`okam` 框架重写了该 API，确保接口使用一致性，更多关于 API 说明可以参考 [全局 API](api/global.md)。

## App 配置

* 不同于原生小程序，其配置不需要定义在 `app.json`，对于 `快应用` 不需要在 `manifest.json` 里定义，而是定义在入口脚本的 `config` 属性字段

* 配置定义跟原生小程序定义完全保持一致

* 特定平台的配置支持：具体可以[参考这里](advance/platformSpecCode#配置)

## 快应用配置

由于快应用的应用配置跟小程序差异性比较大，这里单独介绍下快应用的配置。`okam` 框架支持开发者依旧使用微信小程序配置方式来配置快应用的 App 配置，下面列出微信小程序的 App 配置跟快应用的映射关系：

|微信配置名|快应用的配置名|
|---|---|
|pages|router.pages 和 router.entry|
|subPackages|router.pages|
|debug|config.logLevel|
|-|designWidth|
|window|display|
|-|features|

* `pages` 转成 快应用配置规则

    * `pages` 数组第一项作为快应用的入口页面，即 `router.entry` 值来自于该字段的第一个数据项
    * pages 值转成快应用 page 规则，以 `pages/home/index` 为例，最后转成的快应用的页面信息为：`{pageName: 'pages/home', componentName: 'index'}`，即该页面组件的文件名作为 `组件名`，组件所在的目录作为 `文件名`
    * 如果需要定义页面 `filter` 信息，如果不考虑一套代码多平台复用，可以直接定义成对象形式，否则需要单独针对平台单独定义
    * **注意** 快应用原生要求每个页面目录只能放一个页面组件，如果使用 `okam` 是允许一个目录个多个页面组件，经过构建编译会重新调整页面的路径，页面路由导航 url 要求开发者使用绝对地址，即 `/` 开头的 url。

* `debug` 转成 快应用配置规则

    * `debug` 如果 `true` 则转成 `{config: { logLevel: 'debug' }}`
    * `debug` 如果 `false` 则转成 `{config: { logLevel: 'off' }}`

* `designWidth` 配置值依赖于构建全局配置的 `designWidth` 配置的值，具体可以看[构建配置定义](build/index.md)

* `window` 转成 快应用配置规则

    * 默认按如下属性对应关系转换，对于非快应用支持的配置属性将直接被滤掉，**注意：** `快应用` 的 `backgroundColor` 是页面背景色，而 `微信小程序` 是指页面下拉的背景色，因此这两个属性含义是不同的。

    * 如果存在 `display` 配置，则将该配置跟 `window` 转换过的 `display` 配置做 merge，已有 `display` 配置优先级高于 `window` 里定义的

|微信 window 配置属性名|快应用 display 配置属性名|
|---|---|
|backgroundColor|backgroundColor|
|-|fullScreen|
|-|titleBar|
|navigationBarBackgroundColor|titleBarBackgroundColor|
|navigationBarTextStyle|titleBarTextColor|
|navigationBarTitleText|titleBarText|
|-|menu|

* 页面 `display.pages` 配置

    * **注意** 快应用是没有单独的页面配置，其配置跟应用配置是放一起定义的
    * 对于 `display` page 配置 **要求** 按 `页面组件路径` 来配置，会自动转成按页面名方式来配置：`{'pages/home/index': {titleBarText: 'hi'}}` 会转成 `{'pages/home': {titleBarText: 'hi'}}`
    * `okam` 会收集每个页面定义的配置信息，然后将其规范化后同 App 配置里的 `display.pages` 做 merge，各个页面定义的配置优先级高于 App 配置里定义的页面配置
    * 每个页面配置转换规则同上述 `window` 微信属性转换
    * `okam` 扩展的页面配置 `data` 配置
        * 快应用对于页面的 data 有权限的定义，可能是 `private`、`protected`、`public`，在 `okam` 里默认为 `private`，为了修改页面的权限，可以通过在页面配置里定义 `{_quickEnv: {data: 'public'}}`

* 快应用 `features` 配置

    * 快应用使用到的大部分系统API 都需要通过 `features` 属性添加声明，方可使用
    * `okam` 对于 `features` 配置，除了官方文档定义的方式之外，还提供了两种定义方式：
        * `字符串` 形式：`{features: ['system.audio', 'system.fetch']}`
        * `数组` 形式：`{features: [ ['service.wxpay', {sign: 'xx'}] ]}`，数组第一个元素为接口名，第二个元素为接口参数
    * 如果你不需要额外配置接口参数信息，完全可以不用配置 `features` 属性，`okam` 会分析代码里使用的系统 API 自动添加对应的接口声明，目前主要对以 `@system.` 或者 `@service.` 开头的模块 Id 进行接口声明，除 `@system.router` 和 `@system.app` 外，由于这两个接口不需要声明就可以使用，如果想修改规则，可以通过构建配置 `resolve` 配置进行定制修改，具体可以看[构建配置定义](build/index.md)


## App 样式

* 样式定义跟原生小程序保持一致

* 可以根据框架提供的[语言扩展](advance/language.md)，使用 `stylus` 或者 `less` 等各种预处理语言，通过文件的后缀名来区分使用的预处理语言

* 如果你开发的是快应用，需要注意快应用支持的样式比较有限，具体可以参考[官网](https://doc.quickapp.cn/tutorial/framework/page-style-and-layout.html)

**注意：** 快应用没有全局的 `app` 样式，如果项目里定义了全局的 `app` 样式，则会自动在每个页面导入该全局的 `app` 样式。

