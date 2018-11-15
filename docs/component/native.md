# 原生自定义组件支持

通常我们可能需要复用来自开源社区的一些原生自定义组件，不管是否是以 `NPM` 包形式复用。目前 `Okam` 框架除了允许开发者使用框架提供的组件语法定义组件外，还可以在项目中直接引用原生自定义组件。可以直接将代码拷贝放进项目里，也可以通过 NPM 包形式安装，使用方式完全跟基于框架定义的自定义组件一样。

**注意：** 由于原生自定义组件，不同小程序实现有些不同，因此目前还不支持使用某个小程序比如微信的自定义原生组件，然后在不同小程序端进行复用，因此如果你使用了原生的自定义组件，意味着无法做到同一套代码在不同小程序端进行复用。目前我们正在努力把一些开源的比较知名的微信组件库移植到不同小程序端上，但这依赖于各个开源项目的实现方式，这决定了我们能否将这些项目迁移到各个小程序端，当然不排除未来会考虑推出一套针对多端支持的组件库。

## 原生自定义组件使用

* 假设有个自定义组件定义在 `src/components` 目录下，具体包含如下几个文件

    * `native.swan`
    * `native.css`
    * `native.js`

* 在的 `home` page 使用原生组件方式

```pages/home.vue
<template>
    <view>
        <native @click="handleClick"></native>
    </view>
</template>
<script>
import native from '../components/native';

export default {
    components: {
        native
    },

    methods: {
        handleClick(e) {
            console.log('event data', e.detail);
        }
    }
};
</script>
<style>
</style>
```
