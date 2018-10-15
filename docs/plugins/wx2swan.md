# 自定义组件互转

## okam-plugin-wx2swan

当在百度小程序中想引入已有的微信小程序自定义时组件时 ，可通过引入及配置此插件来进行转换，其中，微信小程序自定义组件可为 [微信官方支持的开发第三方自定义组件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/trdparty.html),
也可为常规的 `npm` 包的写法；

!>  限制：在百度小程序中引入微信自定义组件，不支持 `wxs`、`模板引用`，只做了语法上的转换；swan框架、API和组件功能上的差异，待原生小程序层支持中


### 安装

`npm install okam-plugin-wx2swan --save-dev`


### 配置

swan.config.js 加上如下配置：


``` javascript
{

    processors: {
        // babel: {
        //    extnames: ['js']
        // },

        wx2swan: {
            // 注册 及 配置 wxml、wxss 文件转换
            extnames: ['wxml', 'wxss']
        }
    },
    rules: [
        {
            // 配置 js 文件转换
            match(file) {
                return file.isNpmWxCompScript;
            },
            processors: ['wx2swan']
        }
    ]

}

```

### 引用
`page` 中的引入方式和其他自定义组件引入相同；


```
node_modules

min-components
├── components
│   │
│   ├── one
│   │   ├── comp.js    comp 组件逻辑
│   │   ├── comp.json  comp 组件配置
│   │   ├── comp.wxml  comp 组件结构
│   │   └── comp.wxss   comp 组件样式
│   │ 
│   └── another
│       ├── comp.js    comp 组件逻辑
│       ├── comp.json  comp 组件配置
│       ├── comp.wxml  comp 组件结构
│       └── comp.wxss   comp 组件样式
├── index.js
└── package.json         包的相关配置： name 、main

src
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

在 `index.okm` 引入 `node_modules` 中的组件
假设包名：`min-components` ，入口文件为 `index.js`

```
<template>
    <view class="comp-page">
        <view class="title">原生自定义组件引入</view>
        <origin-npm-wx-comp out-text="百度小程序中依赖 min-componen 中的微信原生的组件">
        </origin-npm-wx-comp>
    </view>
</template>

<script>
import OriginNpmWXComp from 'min-component/components/one/comp';

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
    }
};
</script>

<style lang="css">
</style>

```
