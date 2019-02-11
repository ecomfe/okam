# 原生组件支持

使用 `okam` 开发时，不仅支持单文件组件开发模式，还支持原生小程序自定义组件写法，即 使用 `okam` 开发时，想引入其他的原生自定义组件也是可以满足的；
目前提供了 `本地引入` 、 `npm 引入` 两种方式；

!>1.不支持原生自定义组件开发的小程序版本，也不支持此功能<br>
2.不同小程序对于原生自定义组件的实现有些不同，所以在使用某个小程序情况下，不能使在其他各个小程序端都能直接进行复用。


## 同平台

想在 `okam` 项目代码库中，引入同平台部分原生已有的组件库，可是使用此功能；

### 本地引入使用

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
        <origin-comp
            @change="handleFn"
            out-text="依赖 本项目中 原生的组件">
        </origin-comp>

        <hello @click="handleFn"></hello>
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
        handleFn(e) {
            console.log('event data', e.detail);
        }
    }
};
</script>

<style lang="css">
</style>

```

** 注意 **

* 在页面中调用原生组件时可以直接使用 `okam` 支持的语法
* 组件上的 `@change` 对应的是 自定义组件中的名为 `change` 事件

## 同平台

在 `okam` 中，不仅支持 `NPM` 包的依赖管理和引用, 还支持对第三方原生小程序自定义组件引入支持;
如：在开发微信时，想使用同平台已有的第三方原生组件库，无需二次拷贝过程，可以直接用 `npm` 方式，进行引入；

### npm 引入使用

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
        <origin-npm-comp
            out-text="依赖 min-componen 中的原生的组件"
            @change="handleFn">
        </origin-npm-comp>
        <okam-npm-comp
            out-text="依赖 min-componen 中的okam的组件"
            @click="handleFn">
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
        handleFn(e) {
            console.log('event data', e.detail);
        }
    }
};
</script>

<style lang="css">
</style>

```

** 注意 **

* 在页面中调用原生组件时可以直接使用 `okam` 支持的语法
* 组件上的 `@change` 对应的是 自定义组件中的名为 `change` 事件

## 跨平台

跨平台情况下，如果想在小程序中引入其他小程序自定义组件，npm、本地的引入使用方式与同平台一样，但需要通过添加插件及配置项来支持自定义组件互转，目前跨平台引入仅支持：百度引微信小程序。

### npm及本地引入使用

百度中引微信小程序：[详细使用过程及示例参见](component/transform.md?id=wx2swan)

* 第一步：在构建配置`swan.config.js`中，开启 `{wx2swan: true}` 配置项，
* 第二步：对组件进行 npm 或 本地引用，使用方式与同平台一样

