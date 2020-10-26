# Promise化 API

## 原生小程序异步 API

* 目前小程序很多 API 都是异步的，但对于异步调用结果，依旧只能通过传入 callback 参数方式来执行，不支持返回 Promise 方式

* 这些异步 API 的接口签名参数都有如下共同特征，因此基于这个共同特征，我们可以统一将其转化为返回 Promise 的 API：

    ```javascript
    // xxx 指代那些异步回调的接口名
    swan.xxx({
        fail(err) {
            // execute fail callback
        },

        success(res) {
            // execute success callback
        }
    })
    ```

* 小程序异步 API

    * `swan.request`: 请求 API

    * `swan.uploadFile`: 上传文件 API

    * `swan.getSystemInfo`: 获取系统信息

    * ...

## 异步 API Promise 化

* 基于小程序 API 可能随着版本迭代，API 可能会一直发生变化，因此开发框架实现上，默认没有将所有异步 API 都转成 `Promise` 方式，而是让开发者根据自己的开发需要进行转换，这样可以避免开发框架需要因为异步 API 的变化而重新发版支持，缺点是开发者需要自行配置要转换的接口

* 为了转成 `Promise` 化 API，需要确保小程序原生是支持 `Promise`，如果不支持，需要引入 `polyfill` 支持，具体需要在构建配置文件`swan.config.js` 加上如下配置，目前百度小程序是支持 `Promise` 的，因此无需引入 `polyfill`

    ```javascript
    {
        // 如果小程序不支持全局挂载，将 `polyfill` 改为 `localPolyfill`
        polyfill: ['promise']
    }
    ```

* App 入口脚本加上如下配置

    ```javascript
    // src/app.js

    export default {
        // ...

        $promisifyApis: ['getSystemInfo', 'uploadFile'], // 声明要转成 Promise 异步接口

        // ...
    };

    ```

* 整个小程序里任何地方调用所有要转化成 Promise 的 API 都会自动转成 Promise，API 调用方式依旧相同，只是返回变成 `Promise`: `this.$api.xxx().then(success, fail)`，`xxx` 对应 `$promisifyApis` 声明要转化的 API 接口名

    ```javascript
    // Page 脚本

    export default {
        config: {},

        data: {},

        mounted() {
            this.$api.getSystemInfo().then(res => {
                console.log(res);
            });
        }
    }
    ```

!> 默认情况下，对于 `request` 接口已经提供了转化为 Promise 的接口，具体可以参考[HTTP请求](advance/http.md)。
