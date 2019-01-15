# 全局 API

## okam-core API

### API 访问

!> 要求 core 版本至少 `0.4.5`，如果之前老的版本，可以通过 `okam-core/src/na/index` 及 `okam-core/src/na/request` 导出的 API 获取

```javascript
export {
    appEnv,
    appGlobal,
    api,
    getCurrApp,
    getCurrPages,
    request,
    platform
} from 'okam'; //  或者 export {appEnv} from 'okam-core';
```

### appEnv
平台环境变量，不同平台其取值对应不同平台的环境对象：

* 百度小程序：`swan`
* 微信小程序：`wx`
* 支付宝小程序：`my`
* 头条小程序：`tt`
* 快应用：取值同 `appGlobal`，见下面说明

如果想访问原生 API 定义，可以直接 `appEnv.getSystemInfo()` 形式访问，环境变量除了 `快应用` 外，原生定义的所有 API 都可以通过下面 `api` 对象访问，具体区别可以见下面说明。

### appGlobal
全局对象，具体定义除了快应用外，其它小程序平台定义如下：

```javascript
function getAppGlobal() {
    if (typeof window === 'object' && window && window.Math === Math) {
        return window;
    }

    /* istanbul ignore next */
    if (typeof self === 'object' && self) {
        return self;
    }

    let result;
    try {
        if (typeof Function === 'function') {
            result = Function('return this')();
        }
    }
    catch (e) {
        // ignore exception
    }

    if (!result) {
        result = (typeof global === 'object' && global) || this;
    }

    return result || {};
}
```

快应用定义：

```javascript
const appGlobal = Object.getPrototypeOf(global) || global;
```

### api
平台提供的 API，都可以通过该对象访问到，同 `app` `component` 和 `page` 上下文定义的 `$api` 相同。

跟 `appEnv` 获取到的 API 区别是，该对象定义的 API 可能会发生修改，比如[API Promise 化](app/promise.md)，比如对 `getSystemInfo` 经过 `promise 化` 转换后，`appEnv.getSystemInfo()` 接口定义还是同原生，但 `api.getSystemInfo()` 返回的是 `promise`。

此外，该对象定义的 `API` 目标是希望各个平台对齐的，开发者也可以自行对 `api` 对象下挂载的接口进行扩展或者对齐，具体可以参考[特定平台 API 实现](advance/platformSpecCode#API)。

因此，建议开发者直接使用 `api` 对象来访问平台提供的 API。

### getCurrApp
获取当前 App 实例，快应用实现跟其它小程序平台稍微有所差异：

* 快应用：目前返回的是 app 信息，通过该模块 `'@system.app'` 获取
* 小程序：直接使用原生提供的 `getApp()` 全局 API 获取

### getCurrPages
获取当前打开的页面实例数组，快应用实现跟其它小程序平台稍微有所差异：

* 快应用：返回 null，暂不支持
* 小程序：直接使用原生提供的 `getCurrentPages` 全局 API 获取

### request

定制化的平台 `request` 对象，支持返回 `promise`，其定义同 `app` `component` 和 `page` 上下文定义的 `$http` 相同

* `request.get(url, options)`: 发起一个 `GET` 请求，请求选项可以参考原生请求接口[定义](https://smartprogram.baidu.com/docs/develop/api/net_request/)

* `request.post(url, options)`: 发起一个 `POST` 请求

* `request.fetch(url, options)`: 发起自定义 `Method` 请求

* `request.request(options)`: 同原生 `request` API，支持返回 `Promise`

```javascript
request.fetch(
    'http://xxx.com/xx',
    {method: 'PUT', data: {}}
).then(
    res => console.log(res),
    err => console.error(err)
);
```

### platform

平台信息相关接口定义，基于 `api.getSystemInfo()` 获取，由于信息获取是异步的，为了保证信息可用性，需要使用下面 `ensure` API 进行包裹。

* `ensure(callback)`: 确保平台信息已经可用，只有当信息可用了，下面的 API 才可以直接访问，该接口同时会缓存获取的系统信息，下次再访问如果缓存可用，直接返回缓存的平台信息

* `setPlatformInfo(systemInfo)`: 手动设置平台信息，如果不想基于 ensure 来确保可用，可以外部直接获取后，调用该接口设置下，系统信息会被缓存

* `getPlatformInfo(): Object`: 获取平台信息

* `isIOS(): boolean`: 是否是 `iOS` 操作系统

* `isAndroid(): boolean`: 是否是安卓操作系统

* `getSDKVersion(): string`: 获取平台 sdk 版本信息

* `isSDKVersionLt(version): boolean`: 判断当前的 sdk 版本是否小于给定的版本号（是否当前版本比较老）

* `isSDKVersionLte(version): boolean`: 判断当前的 sdk 版本是否小于给定的版本号或者一样

* `isSDKVersionGt(version): boolean`: 判断当前的 sdk 版本是否大于给定的版本号（是否当前版本更新）

* `isSDKVersionGte(version): boolean`: 判断当前的 sdk 版本是否大于给定的版本号或者一样

* `isSDKVersionEq(version): boolean`: 判断当前的 sdk 版本是否同给定的版本号一样

## 各个平台对齐的 API

目前未提供对齐的 API 或者组件，开发者可以参考[撰写特定平台代码](advance/platformSpecCode)实现不同平台对齐。同时，我们也非常希望开发者把自己对齐的 API/组件 也可以开源出来，以帮助更多开发者，如果能直接发 pr 贡献到 `okam` 最好。

下面列出的 API 是各个平台已经对齐的接口，没列出来，表示我们未做任何对齐实现，具体是否需要对齐需要开发者自行调研。如果开发者，想覆盖掉默认的对齐实现也是允许的，实现方式跟新增要对齐 API。

### 微信小程序

> 暂无

### 百度小程序

> 暂无

### 支付宝小程序

* `showToast`
* `getSystemInfo`
* `getSystemInfoSync`
* `setNavigationBarTitle`

### 头条小程序

> 暂无

### 快应用

`快应用` 并没有像其它小程序平台提供了全局的 `API` 供访问，目前 `Okam` 框架参照 `微信小程序` 封装对齐了微信部分 API，建议开发者通过[扩展全局API方式](advance/platformSpecCode#API)来新增 API，不建议自行 `import clipboard from '@system.clipboard'` 方式来访问，除非你不考虑多平台支持，此外导入接口包一般情况下也不需要配置 `features`，具体可以参考[配置说明](app/entry#快应用配置)。

* `getSystemInfo`
* `showToast`
* `request`
* `navigateBack`
* `navigateTo`
* `redirectTo`

