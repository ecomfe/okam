# HTTP 请求

## 原生请求接口

* `swan.request`: 默认情况下，你可以在组件、页面或者 App 上下文使用 `this.$api.request()` 调用原生请求接口

## 请求 Promise 化

* 默认组件、页面或者 App 上下文提供了一个封装好的请求对象: `$http`

* 该请求对象请求接口默认返回的是 `Promise`，建议开发过程中直接使用该请求对象发起 HTTP 请求

* 请求对象接口

    * `$http.get(url, options)`: 发起一个 `GET` 请求，请求选项可以参考原生请求接口[定义](https://smartprogram.baidu.com/docs/develop/api/net_request/)

    * `$http.post(url, options)`: 发起一个 `POST` 请求

    * `$http.fetch(url, options)`: 发起自定义 Method 请求

        ```javascript
        this.$http.fetch(
            'http://xxx.com/xx',
            {method: 'PUT', data: {}}
        ).then(
            res => console.log(res),
            err => console.error(err)
        );
        ```

!> 如果接口请求想在页面组件外部实现，可以参考 `okam-core` 提供的 [API](api/global)。
