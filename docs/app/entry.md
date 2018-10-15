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

## App 扩展 API

* `$api`: 挂载所有原生小程序 API，App 上下文访问：`this.$api.xxx()` 等价于 `swan.xxx()`，建议小程序都摒弃特定小程序命名空间 API 访问方式，方便以后同一套代码转成其它平台端的小程序

* `$global`: 小程序提供的全局对象

* `$http`: 封装了 `swan.request` 接口的 HTTP 请求接口，具体使用说明可以参考 [HTTP请求](advance/http.md)

## App 配置

* 不同于原生小程序，其配置不需要定义在 `app.json`，而是定义在入口脚本的 `config` 属性字段

* 配置定义跟原生小程序定义完全保持一致

## App 样式

* 样式定义跟原生小程序保持一致

* 可以根据框架提供的[语言扩展](advance/language.md)，使用 `stylus` 或者 `less` 等各种预处理语言，通过文件的后缀名来区分使用的预处理语言

