# 第三方组件引入
使用 `okam` 开发时，除了提供便捷的单文件组件开发模式，还对原生小程序自定义组件进行了支持，即 使用 `okam` 开发时，想引入其他的原生自定义组件也是可以满足的；
提供了 `本地引入` 、 `npm 引入` 两种方式；

!> 不支持原生自定义组件开发的小程序版本，也不支持此功能

## 本地原生自定义组件引入
在本地创建或将第三方原生自定义组件拷贝至 `okam` 开发框架项目中

```
.
├── components
│   │
│   ├── origin
│   │   ├── comp.js    comp 组件逻辑
│   │   ├── comp.json  comp 组件配置
│   │   ├── comp.swan  comp 组件结构
│   │   └── comp.css   comp 组件样式
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

`components/origin` 为原生的[小程序自定义组件](https://smartprogram.baidu.com/docs/develop/framework/custom-component/)

在 `index.okm` 引入 `components/origin/comp`

```
<template>
    <view class="comp-page">
        <view class="title">原生自定义组件引入</view>
        <origin-comp out-text="依赖 本项目中 原生的组件">
        </origin-comp>
    </view>
</template>

<script>
import OriginComp from '../../components/origin/Comp';

export default {
    config: {
        navigationBarTitleText: '自定义组件示例'
    },

    components: {
        OriginComp
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

## npm 原生自定义组件引入
`okam` 不仅支持 `NPM` 包的依赖管理和引用, 还可以对第三方原生小程序自定义组件引入支持;


```
node_modules

min-components
├── components
│   │
│   ├── one
│   │   ├── comp.js    comp 组件逻辑
│   │   ├── comp.json  comp 组件配置
│   │   ├── comp.swan  comp 组件结构
│   │   └── comp.css   comp 组件样式
│   │ 
│   └── another
│       ├── comp.js    comp 组件逻辑
│       ├── comp.json  comp 组件配置
│       ├── comp.swan  comp 组件结构
│       └── comp.css   comp 组件样式
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
        <origin-npm-comp out-text="依赖 min-componen 中的原生的组件">
        </origin-npm-comp>
    </view>
</template>

<script>
import OriginNpmComp from 'min-component/components/one/comp';

export default {
    config: {
        navigationBarTitleText: '自定义组件示例'
    },

    components: {
        OriginNpmComp
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

## npm 其他小程序自定义组件引入
若想在百度小程序中引入微信小程序自定义组件，可通过添加插件及配置项来支持，[详见 okam-plugin-wx2swan 使用](plugins/wx2swan?id=wx2swan)
