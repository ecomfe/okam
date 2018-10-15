# API Hook

如果你想针对某些原生 `API` 调用做些日志监控打印，或者想对于某些 `API` 的调用参数或者返回值做预处理，比如 `request` 接口统一加上某个请求参数，对返回的响应数据做格式化，可以使用开发框架提供的 `API` 拦截功能。

配置要拦截的 API：App 入口脚本 `$interceptApis` 属性加上如下配置

* key 为 API 名称，所有定义在 `this.$api` 下的接口都可以拦截
* value 为拦截的 API 提供的两个钩子函数，这两个钩子函数最后一个参数为组件实例
    * `init(args, ctx)`: API 调用时候传入的参数的初始化逻辑，你可以在这个钩子里改写要传入的参数，**注意：** 传入的参数是引用，直接修改即可，如果有 API 传入多个参数，或者只支持一个非引用形式的参数，会被转成数组形式传入到钩子函数，e.g., `this.$api.xxx(2, true)`, `init` 的 `args` 参数为 `[2, true]`，这样可以直接 `args[0] = 3;` 方式来修改参数
    * `done(err, res, ctx)`: API 调用完成的回调，可以在这个钩子对返回结果进行改写，但只支持 `同步 API` 或者 `返回 Promise 的异步 API`，第一个参数 `err` 如果不为 `null`，则表示调用失败，`res` 为调用成功返回的值，对于返回 `Promise` API ，如果你想依旧保持出错时候触发 `reject` 回调，需要在该钩子函数 `throw err`。

    ```javascript
    // src/app.js

    export default {
        // ...

        $interceptApis: {
            request: {
                init(args, ctx) { // 最后一个参数为 app 实例
                    console.log('init options', options);
                    // 可以改写请求参数
                },
                done(err, res, ctx) { // 最后一个参数为 app 实例
                    console.log('done...', err, res);
                    if (err) {
                        console.error('request error', err);
                        throw err;
                    }

                    return res;
                }
            }
        }

        // ...
    };

    ```

!> 如果你传入 `request` API的拦截，则组件实例的 `this.$http` 的接口调用也会自动被拦截，即访问 `this.$http.get` `this.$http.post` `this.$http.fetch` 都会自动触发该接口的拦截。
