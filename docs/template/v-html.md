# v-html

> `okam` 从 `okam-core: 0.4.22` 版本开始支持

默认不开启，需在配置项中，配置 `v-html` 支持


``` base.config.js
{
    framework: [
        // ...
        'vhtml'
        // ...
    ]
}
```

## 支持项

|平台|百度|微信|支付宝|头条|快应用|
|---|---|---|---|---|
|支持情况|√|√|√|√|x|
|v-html可取值|nodes/string|nodes/string|nodes|nodes/string|x|

> 1.指令为 `v-html`，而不是像基础指令一样为 `html`，这样是以防止与原生或用户属性冲突;<br>
  2.想要 让所有指令保证统一 推荐开启 `v-` 指令支持, [详见](template/vueSyntax.md);


## 实现原理

原生 `rich-text` 的封装，`v-html` 是其语法糖，其对应的取值依赖原生, 因此对于的标签、属性及事件限制都与原生对齐

!> 1.原生 `rich-text` 受限的 `v-html` 同样受限<br>
   2.支付宝 `rich-text` 不支持 `string` 类型<br>
   3.nodes 不推荐使用 `String` 类型，性能会有所下降<br>
   4.其他更多限制请查看 原生 `rich-text` 限制项

## 多平台 使用
* 第一步：在 `base.config.js` 配置了 `vhtml` 支持；

``` base.config.js
{
    framework: [
        // ...
        'vhtml'
        // ...
    ]
}
```

* 第二步：如果需要支持支付宝平台， `npm install mini-html-parser2 --save`
``` ant.config.js
{
    api: {
        htmlToNodes: 'mini-html-parser2'
    }
}
```

* 第三步：多平台支持

``` pages/index.vue
<template>
<view class="sub-title">v-html 多平台 arrayData 支持</view>
<div v-html="arrayNodes"></div>

<view class="sub-title">v-html 多平台 string 支持</view>
<div v-html="stringNodes"></div>

</template>

<script>
let str = '<div class="desc">div 标签</div>';
let arr = [{
    name: 'div',
    attrs: {
        class: 'test_div_class',
        style: 'color: green;'
    },
    children: [{
        type: 'text',
        text: 'Hello&nbsp;World! This is a text node.'
    }]
}];

export default {
    data: {
        arrayNodes: arr,
        stringNodes: process.env.APP_TYPE === 'ant' ? [] : str
    },

    onLoad() {
        if (process.env.APP_TYPE === 'ant') {
            // 对应 api 配置项
            this.$api.htmlToNodes(str, (err, nodes) => {
                if (!err) {
                    this.stringNodes = nodes;
                }
            });
        }
    }
}
</script>
```

* 注意：
此处支付宝小程序提供的 `mini-html-parser2` 部分情况可支持跨平台的 `nodes` 转换，酌情选择，如果想多平台在`rich-text` 用 `nodes` 类型 则将 第二步的配置项加在 `base.config.js` 配置项中，将第三步的环境判断去掉

* 附：
    * [百度 rich-text](https://smartprogram.baidu.com/docs/develop/component/base/#rich-text/)
    * [微信 rich-text](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html)
    * [支付宝 rich-text](https://docs.alipay.com/mini/component/rich-text)
    * [头条 rich-text](https://microapp.bytedance.com/docs/comp/rich-text.html)
