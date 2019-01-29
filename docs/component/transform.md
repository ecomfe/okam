# 组件互转
组件跨平台转换

## wx2swan
将微信小程序组件转为百度小程序，支持 page组件、自定义组件转换

### 使用场景

在开发百度小程序时

- 已有微信小程序或当前 okam 小程序项目中的部分页面或自定义组件存在微信小程序语法
- 想在百度小程序中使用已有微信小程序自定义组件库

### 使用方式

`wx2swan` 的支持方式是将微信小程序在 `npm run dev` 构建阶段转为生成符合百度语法的小程序。

* 第一步：配置：在 `swan.config.js` 构建文件中，设置如下构建项：


``` swan.config.js
{
    wx2swan: true
}

```

* 第二步：引入使用

假设：在开发百度小程序时，在 `index.okm` 中引入微信小程序组件库;

1.引入

* npm 引入：`npm install min-components --save-dev`，开发时将 `min-components` 换成真实的组件库包名;
* 本地引入：拷贝至 自身项目文件

> 二选一，如有线上 `npm` 包，推荐使用 `npm` 引入方式以减少代码仓库体积大小，以及方便管理组件库的更新升级；
okam 中 对 npm 进行了适配支持，即满足 正常 npm 包 格式即可引入

```
.
├──node_modules
│   ├──min-components
│   │   ├── components
│   │   │   │
│   │   │   ├── origin
│   │   │   │   ├── comp.js    comp 组件逻辑
│   │   │   │   ├── comp.json  comp 组件配置
│   │   │   │   ├── comp.wxml  comp 组件结构
│   │   │   │   └── comp.wxss   comp 组件样式
│   │   │   │ 
│   │   │   ├── okam
│   │   │   │   └── comp.vue   okam 组件逻辑、配置、结构、样式
│   │   │   │   
│   │   │   └── another
│   │   │     ├── comp.js    comp 组件逻辑
│   │   │     ├── comp.json  comp 组件配置
│   │   │     ├── comp.wxml  comp 组件结构
│   │   │     └── comp.wxss   comp 组件样式
│   │   ├── index.js
│   │   └── package.json          包的相关配置： name 、main
└──src
    ├── components
    │   │ 
    │   └── Hello.okm  Hello 组件逻辑、配置、结构、样式
    │ 
    ├── pages
    │   ├── home
    │   │   └── index.okm        index 页面逻辑、配置、结构、样式
    │   └── other
    │       ├── detail1.okm      detail1 页面逻辑、配置、结构、样式
    │       └── detail2.okm      detail2 页面逻辑、配置、结构、样式
    ├── app.js              小程序逻辑、公共配置
    └── app.css             小程序公共样式
```

* 2.使用：以下为 `npm 引入` 方式示例

    * 在页面中调用原生组件时可以直接使用 `okam` 支持的语法
    * 组件上的 `@change` 对应的是 自定义组件中的名为 `change` 事件


```
<template>
    <view class="comp-page">
        <view class="title">原生自定义组件引入</view>
        <origin-npm-wx-comp
            @change="handleFn"
            out-text="百度小程序中依赖 min-componen 中的微信原生的组件">
        </origin-npm-wx-comp>
    </view>
</template>

<script>
// 根据 node_modules 中包名的路径来写对应路径，引用方式与 web 写法一致
import OriginNpmWXComp from 'min-component/components/origin/comp';

export default {
    config: {
        navigationBarTitleText: '自定义组件示例'
    },

    components: {
        OriginNpmWXComp
    },

    data: {
    },

    methods: {
        handleFn(e) {
            console.log('event data', e.detail);
        }
    }
};
</script>

<style lang="css">
</style>

```

* 第三步: `npm run dev`，查看 `dist` 目录可以看到微信转为百度小程序之后的代码


### 使用限制

* 在百度小程序中引入微信自定义组件时，只做语法上的基本转换，swan框架、API和组件功能上的差异，待原生小程序层支持
* `wxs` 转 `filter`，仅简单支持以下格式，其他不支持

```
module.exports = {
    fn1: function () {

    },

    fn2: funciton () {

    }
}
```
* 页面常见组件库中使用到的 `getRelationNodes、relations` 不支持转换
* 百度下，字体渲染：ios 真机正常 、android 不正常，因此字体不能正常使用
* 转换存在的问题，原生问题需要手动修改或通过添加[特定平台代码](/advance/platformSpecCode)进行修改


### 代码示例
* 百度小程序中使用 `iview` 的代码示例及支持情况总结，[okam-iview-example](https://github.com/awesome-okam/okam-iview-example)
