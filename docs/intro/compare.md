# 平台支持

**说明：** 下面对比表格，生命周期对比表格里，括号里注明的为对应的原生生命周期调用方法

## App 生命周期
|生命周期|微信|百度|支付宝|头条|快应用|
|---|---|---|---|---|---|
|onLaunch|√|√|√|√|√（`onCreate`）|
|onShow|√|√|√|√|x|
|onHide|√|√|√|√|x|
|onError|√|√|√|√|√（[1030+](https://doc.quickapp.cn/changelog/1030.html)支持）|

## Page 生命周期

|生命周期|微信|百度|支付宝|头条|快应用|
|---|---|---|---|---|---|
|beforeCreate|√（`onLoad`）|√（`onLoad`）|√（`onLoad`）|√（`onLoad`）|√（`onInit`）|
|created|√（`onLoad`）|√（`onLoad`）|√（`onLoad`）|√（`onLoad`）|√（`onInit`）|
|beforeMount|√（`onReady`）|√（`onReady`）|√（`onReady`）|√（`onReady`）|√（`onReady`）|
|mounted|√（`onReady`）|√（`onReady`）|√（`onReady`）|√（`onReady`）|√（`onReady`）|
|beforeDestroy|√（`onUnload`）|√（`onUnload`）|√（`onUnload`）|√（`onUnload`）|√（`onDestroy`）|
|destroyed|√（`onUnload`）|√（`onUnload`）|√（`onUnload`）|√（`onUnload`）|√（`onDestroy`）|
|onShow|√|√|√|√|√|
|onHide|√|√|√|√|√|

## 自定义组件生命周期

|生命周期|微信|百度|支付宝|头条|快应用|
|---|---|---|---|---|---|
|beforeCreate|√（`created`）|√（`created`）|√（`didMount`）|√（`created`）|√（`onInit`）|
|created|√|√|√（`didMount`）|√|√（`onInit`）|
|beforeMount|√（`attached`）|√（`attached`）|√（`didMount`）|√（`attached`）|√（`onReady`）|
|mounted|√（`ready`）|√（`ready`）|√（`didMount`）|√（`ready`）|√（`onReady`）|
|beforeDestroy|√（`detached`）|√（`detached`）|√（`didUnmount`）|√（`detached`）|√（`onDestroy`）|
|destroyed|√（`detached`）|√（`detached`）|√（`didUnmount`）|√（`detached`）|√（`onDestroy`）|

## 页面路由导航

路由导航，统一使用如下 API：
* `$api.navigateBack`
* `$api.navigateTo`
* `$api.redirectTo`

为了保证各个平台导航一致性，建议全部用绝对路径，即导航 url 以 `/` 开头，一方面路径更清晰，其次可以更好兼容 `快应用`。

## 框架能力支持

|功能|微信|百度|支付宝|头条|快应用|备注|
|---|---|---|---|---|---|
|[computed](component/setData#计算属性)|√|√|√|√|√|-|
|[watch](component/setData#监听器)|√|√|√|√|√|-|
|[mixin](component/mixins)|√|√|√|√|√|-|
|[模板复用](template/use)|√|√|√|√|√（`内联实现`）|-|
|[filter](component/filter)|√|√|√|x|√|-|
|[v-model](template/v-model)|√|√|√|√|x|-|
|[ref](component/ref)|√|√|√|√|√|-|
|[broadcast](component/broadcast)|√|√|√|√|√|-|
|[redux状态管理](advance/state)|√|√|√|√|√|-|
|[原生组件支持](component/nativeSupport)|√|√|√|√|√|`不能跨平台`|

## 参考

* `微信小程序`
    * [App 生命周期](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html)
    * [Page 生命周期](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0)
    * [自定义组件生命周期](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)
* `百度小程序`
    * [App 生命周期](https://smartprogram.baidu.com/docs/develop/tutorial/process_life/)
    * [Page 生命周期](https://smartprogram.baidu.com/docs/develop/tutorial/dev_page/)
    * [自定义组件生命周期](https://smartprogram.baidu.com/docs/develop/framework/custom-component_comp/)
* `支付宝小程序`
    * [App 生命周期](https://docs.alipay.com/mini/framework/app)
    * [Page 生命周期](https://docs.alipay.com/mini/framework/page)
    * [自定义组件生命周期](https://docs.alipay.com/mini/framework/develop-custom-component)
* `头条小程序`
    * [App 生命周期](https://developer.toutiao.com/docs/framework/startupApp.html)
    * [Page 生命周期](https://developer.toutiao.com/docs/framework/startupPage.html)
    * [自定义组件生命周期](https://developer.toutiao.com/docs/framework/custom_component_constructor.html)
* `快应用`
    * [生命周期](https://doc.quickapp.cn/tutorial/framework/lifecycle.html)
