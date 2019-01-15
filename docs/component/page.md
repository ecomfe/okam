# Page 组件

> 在 okam 开发框架下， 原生小程序 `Page` 也被设计成跟自定义组件 `Component` 一致的定义方式。

* 新建页面组件，假设对应的项目文件为: `src/pages/home/index.okm`

* 在入口脚本文件 `src/app.js` 的 `config` 配置里更新 `pages` 的值，该配置同原生小程序的 `app.json`

    ```javascript
    // src/app.js
    export default {
        config: {
            pages: [
                'page/home/index'
            ]
        }
    };
    ```

经过 okam 构建工具，`index.okm` 最终会被构建生成四个文件，在 `pages/home` 目录下：`index.js、index.json、index.swan、index.css`

## Page 定义

Page 组件也是被定义成单文件组件的形式，主要由三部分：`<template>`, `<script>`, `<style>` 组成

* `<template>`
    * 语法详见：[模板语法介绍](template/syntax.md)

* `<style>`
    * 样式定义跟原生小程序保持一致
    * 可以根据框架提供的[语言扩展](advance/language.md)，使用 `stylus` 或者 `less` 等各种预处理语言，通过`lang="stylus"`来区分使用的预处理语言
    * 更多进阶处理，参见：[rpx像素单位自动处理](advance/rpx.md)、[autoprefixer使用](build/processors#Postcss插件)

* `<script>`
    * 不需要原生 `Page({})` 方式进行包裹，只需要导出对应的页面脚本定义即可
    * Page 上下文依旧是原生小程序上下文，因此定义同原生小程序
    * Page 实例扩展 API 支持 [详见-扩展 API](component/page.md?id=扩展 API)

页面脚本属性定义：

|属性|说明|
|---|---|
|config|Page 的配置对象，等价于原生小程序的 `.json` 定义。[详见-页面配置](component/page.md?id=页面配置)|
|components|Page 的子组件配置对象，声明 Page 可使用的子组件列表，将自动生成 `.json` 中 `usingComponents` 组件配置定义。[详见-页面配置](component/page.md?id=页面配置)|
|data|Page 渲染数据对象，用于模板绑定的渲染数据。[详见-数据操作](component/setData.md)|
|computed|Page 计算数据对象，声明组件中一个数据项的值需要由其他数据项计算得来的计算数据。[详见-计算属性](component/setData.md?id=计算属性)|
|生命周期| 生命周期函数，包含 `created、mounted、destroyed` 等类 Vue 的一系列生命周期支持。[详见-生命周期](component/page.md?id=生命周期)|
|onXXX| 页面事件处理函数，包含 `onPullDownRefresh、onReachBottom` 等原生小程序页面事件处理函数。[详见原生小程序页面事件](https://smartprogram.baidu.com/docs/develop/framework/app-service_page/)|
|methods|组件的方法，包括事件响应函数和任意的自定义方法，[详见-事件处理及自定义函数](component/page.md?id=事件处理及自定义函数)|

```src/pages/home/index.okm
<template>
    <view class="home-wrap">
         <view class="home-wrap">
            <button class="hello-btn" @click="onHello">{{computedProp}}</button>
            <view class="click-tip" if="clicked">You click me~</view>
            <hello :source="source" :num="num">
                default slot
            </hello>
        </view>
    </view>
</template>
<script>

import Hello from '../../components/Hello';

export default {

    // 同原生小程序配置，部分配置项提供缩略写法，比如 title
    config: {
        title: 'Page Title'
    },

    // 声明要使用的自定义组件
    components: {
        Hello
    },

    // 同原生小程序
    data: {
        btnText: 'xxx',
        num: 12,
        source: 'out source'
    },

    computed: {
        computedProp() {
            return this.btnText + '-suffix';
        }
    },

    // 生命周期
    created() {},
    mounted() {},
    destroyed() {},

    // 显示、隐藏钩子
    onShow() {},
    onHide() {},

    methods: {
        // 事件绑定方法，或者其它方法定义都放在这里
        onHello() {
            this.btnText = 'yyy'; // 直接赋值即可
        }
    }
};
</script>
<style lang="stylus">
</style>
```

## 页面配置

 通过 `config`、`components` 进行页面配置，对应于 原生的 `.json` 文件，部分配置项提供缩略写法，如： `title`、`opacity`

示例

``` javascript
// src/pages/home/index.okm script 部分
export default {
    config: {
        // title 为 navigationBarTitleText 的简写
        title: '小程序标题',
        // opacity 为 enableOpacityNavigationBar 的简写
        opacity: 0,
        navigationBarTextStyle: 'black',
        backgroundColor: '#D0FEE1',
        navigationBarBackgroundColor: '#D0FEE1'
    },
    components: {
        Hello
    }
};
```

上述示例，最终生成 `.json` 文件为：

``` javascript

// index.json

{
    "navigationBarTitleText": "Page Title",
    "enableOpacityNavigationBar": 0,
    "navigationBarTextStyle": "black",
    "backgroundColor": "#D0FEE1",
    "navigationBarBackgroundColor": "#D0FEE1",
    "usingComponents": {
        "hello": "../../components/Hello"
    }
}

```

[原生小程序配置](https://smartprogram.baidu.com/docs/develop/tutorial/process/#window)

## 生命周期
okam 保留了小程序原始生命周期 及全局事件处理函数, 同时提供了一套 vue 生命周期风格的写法

|生命周期|说明|注|
|---|---|
|beforeCreate| 在实例初始化之后，立即同步调用|onLoad 前期|
|created| 实例已经创建完成之后被调用 |onLoad 后期|
|beforeMount|在挂载开始之前被调用|onReady 前期|
|mounted|在实例挂载之后调用|onReady 后期|
|beforeUpdate|暂无|-|
|updated|暂无|-|
|activated|暂无|-|
|deactivated|暂无|-|
|onShow |监听页面显示|保留原生, 对应 onShow|
|onHide |监听页面隐藏|保留原生，对应 onHide|
|beforeDestroy|实例销毁之前调用 | onUnload 前期|
|destroyed|实例销毁后调用 | onUnload 后期|


[原生小程序页面生命周期 及 页面事件处理函数](https://smartprogram.baidu.com/docs/develop/framework/app-service_page/)

!> Page 脚本执行的上下文还是原生小程序 Page 上下文，因此生命周期钩子，依旧可以使用原生提供的，但建议保持一致，要么都使用原生小程序钩子，要么都使用类 Vue 生命周期钩子，这样避免造成混乱。

## 事件处理及自定义函数

* 将函数与页面事件处理分离：原生小程序事件处理及自定义函数移至 `methods` 对象中, 定义响应模板中所监听的事件函数(如bindtap、bindchange)以及用户自定义的函数
* 事件传参简化：事件可直接通过函数参数获取 无需单独经过 `dataset` 层

```
<!--  <template> 部分 -->
<button class="hello-btn" @click="onHello(a, b, $event)">{{computedProp}}</button>

<!-- <script> 部分 -->
<script>
{
    methods: {
        onHello(a, b, e) {
            this.myFun();
        },

        myFun() {
            // ...
        }
    }
}
</script>
```

## 扩展 API

> Page 是继承自自定义组件，因此 Component 的扩展 API，Page 也可以访问到

* `$api`: 挂载所有原生小程序 API，Page 上下文访问：`this.$api.xxx()` 等价于 `swan.xxx()`，建议小程序都摒弃特定小程序命名空间 API 访问方式，方便以后同一套代码转成其它平台端的小程序；
* `$global`: 小程序提供的全局对象；
* `$http`: 封装了 `swan.request` 接口的 HTTP 请求接口；[详见-HTTP 请求](advance/http.md)
* `App` 入口文件声明 `Promise` 化的 API，`Page` 能直接使用；[详见-Promise化 API](app/promise.md)
* data 操作语法类似于 Vue，支持 `computed`，`$nextTick`； [详见-数据操作](component/setData.md)
* `$query`: 获取当前页面查询参数
* `createSelectorQuery`: 创建选择器查询接口，基于全局 API `createSelectorQuery`，这样页面组件、自定义组件（原生提供）上下文都可以用同样方式访问到该接口。`要求升级到 0.4 最新版本` `快应用不支持`

``` javascript
// 当前链接:  xxx?id=3，可通过 this.$query 进行访问获取
const query = this.$query;
const id = query && query.id;
```
