# 本地及第三方原生自定义组件的引入

使用 `okam` 开发时，除了提供的单文件组件开发模式，还对原生小程序自定义组件进行了支持，即 使用 `okam` 开发时，想引入其他的原生自定义组件也是可以满足的；
目前提供了 `本地引入` 、 `npm 引入` 两种方式；

!> 1.不支持原生自定义组件开发的小程序版本，也不支持此功能<br>
不同小程序对于原生自定义组件有些不同，所以不能使用某个小程序情况下，在其他各个小程序端也能直接进行复用。


## 本地引入：同平台自定义组件

在 `okam` 项目代码库中，引入同平台原生组件库；

### 使用

假设：开发百度小程序时，想在 `index.okm` 引入百度原生自定义组件 `components/origin/comp`；

* 第一步：创建或将第三方原生自定义组件拷贝至 `okam` 开发框架项目中的 `components` 目录中

```
// 目录结构

src
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

* 第二步：引用使用，根据上述结构，在的 `index.okam` page 使用原生组件方式，引入方式为：

```
<template>
    <view class="comp-page">
        <view class="title">原生自定义组件引入</view>
        <origin-comp out-text="依赖 本项目中 原生的组件">
        </origin-comp>

        <hello @click="handleClick"></hello>
    </view>
</template>

<script>
import OriginComp from '../../components/origin/Comp';
import Hello from '../../components/Hello';

export default {
    config: {
        navigationBarTitleText: '自定义组件示例'
    },

    components: {
        OriginComp,
        Hello
    },

    data: {
    },

    methods: {
        handleClick(e) {
            console.log('event data', e.detail);
        }
    }
};
</script>

<style lang="css">
</style>

```

## npm 引入：同平台自定义组件
`okam` 不仅支持 `NPM` 包的依赖管理和引用, 还支持对第三方原生小程序自定义组件引入支持;
可以在 `okam` 中开发小程序时，需要引入第三方同平台小程序组件库；

### 使用

假设：想在 `index.okm` 中引入包名为`min-components`，入口文件为 `index.js` 的组件库;

* 第一步：`npm install min-components --save-dev`，开发时将 `min-components` 换成真实的组件库包名;

```
// 目录结构
.
├──node_modules
│   ├──min-components
│   │   ├── components
│   │   │   │
│   │   │   ├── origin
│   │   │   │   ├── comp.js    comp 组件逻辑
│   │   │   │   ├── comp.json  comp 组件配置
│   │   │   │   ├── comp.swan  comp 组件结构
│   │   │   │   └── comp.css   comp 组件样式
│   │   │   │ 
│   │   │   ├── okam
│   │   │   │   └── comp.vue   okam 组件逻辑、配置、结构、样式
│   │   │   │   
│   │   │   └── another
│   │   │     ├── comp.js    comp 组件逻辑
│   │   │     ├── comp.json  comp 组件配置
│   │   │     ├── comp.swan  comp 组件结构
│   │   │     └── comp.css   comp 组件样式
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

* 第二步：引用使用，根据上述结构，引入方式为：

```
<template>
    <view class="comp-page">
        <view class="title">原生自定义组件引入</view>
        <origin-npm-comp out-text="依赖 min-componen 中的原生的组件">
        </origin-npm-comp>
        <okam-npm-comp out-text="依赖 min-componen 中的okam的组件">
        </okam-npm-comp>
    </view>
</template>

<script>
// 根据 node_modules 中包名的路径来写对应路径，引用方式与 web 写法一致
import OriginNpmComp from 'min-component/components/origin/comp';
import OkamNpmComp from 'min-component/components/okam/comp';

export default {
    config: {
        navigationBarTitleText: '自定义组件示例'
    },

    components: {
        OriginNpmComp,
        OkamNpmComp
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

## 跨平台小程序自定义组件 npm、本地引入

如果想在小程序中引入其他小程序自定义组件，需要通过添加插件及配置项来支持自定义组件互转，目前跨平台引入仅支持：百度引微信小程序

### 使用

在构建配置项中，添加 `wx2swan: true`，[详见 wx2swan 使用](plugins/wx2swan?id=wx2swan)
