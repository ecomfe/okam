# v-model

> `okam` 从 `okam-core: 0.4.8`， `okam-build: 0.4.10` 版本开始支持；

提供对表单组件及自定义组件 `v-model` 支持，默认不开启，需在配置项中，配置 `v-model` 支持


``` base.config.js
{
    framework: [
        // ...
        'model'
        // ...
    ]
}
```

## 支持项

|组件|百度|微信|支付宝|头条|快应用|相对应的事件类型|
|---|---|---|---|---|---|
|input|√|√|√|√|x|input|
|textarea|√|√|√|√|x|input|
|picker|√|√|√|√|x|change|
|switch|√|√|√|√|x|change|
|checkbox-group|√|√|√|√|x|change|
|radio-group|√|√|√|√|x|change|
|自定义组件|√|√|√|x|x|change(默认)|

> 1.指令为 `v-model`，而不是像基础指令一样为 `model`，这样是以防止与原生或用户属性冲突;<br>
  2.想要 让所有指令保证统一 推荐开启 `v-` 指令支持, [详见](template/vueSyntax.md);

## 原生组件使用

!>
    1.不支持在 `radio` 、`checkbox` 上直接使用 `v-model`, 搭配 `radio-group`, `checkbox-group` 才能使用。<br>
    2.`radio-group`, `checkbox-group` 使用 `v-model` 时，初始值需要根据场景情况手动处理。<br>
    3.如果用了 `v-model` 建议不要再监听多个对应的事件类型

示例：

```
// input
<input v-model="input1"/>

// picker
<picker
    v-model="timeVal"
    mode="time">
    <view class="picker">
        当前选择: {{timeVal}}
    </view>
</picker>

// switch
<switch name="switch1" v-model="switchVal"></switch>

// checkbox-group
<checkbox-group v-model="checkboxVal">
    <label for="item in items">
        <checkbox :value="item.name"/>
        {{item.value}}
    </label>
</checkbox-group>

// radio-group
<radio-group v-model="radioVal">
    <label for="item in items">
        <radio :value="item.name"/>
        {{item.value}}
    </label>
</radio-group>

// 自定义组件
<model-component v-model="componentVal" />
```

## 自定义组件使用
在小程序里，默认自定义组件上的 `v-model` 会利用 `props` 名为 `value`、 事件名为 `change`、`event.detail`本身值来进行处理；

以 一个 `model-component` 自定义组件为例:

```
<template>
    <view class="model-component-wrap">
        <view>
            自定义组件内部props: {{value}}
        </view>
        <view>
            自定义组件内部data: {{valueInner}}
        </view>
        <input v-model="valueInner" @input="change"/>
    </view>
</template>
<script>
export default {
    data: {
        valueInner: ''
    },
    props: {
        value: String
    },
    mounted() {
        // 不要直接在内部变更 外部传入的 `props` 值
        this.valueInner = this.value;
    },
    methods: {
        change(event) {
            this.$emit('change', event.detail.value);
        }
    }
}
</script>
<style lang="stylus">
// ...
</style>
```

现在在这个组件上使用 `v-model` ：

```
<model-component v-model="componentVal" />
```

## 组件自定义配置支持
在小程序中，自定义组件还可以通过配置构建配置项 `component.template.modelMap` 来进行支持定制化配置

配置项说明:

* modelMap: `Object` 自定义组件 `v-model` 配置项
* modelMap.default: `Object` 变更  自定义组件的 `v-model` 默认配置项
    * modelMap.default.eventType: `string` 必填 事件类型
    * modelMap.default.attrName: `string` 必填 对应 `props` 的属性名
    * modelMap.default.detailName: `string` 选填 `event.detail` 上的字段值的 `key`，如果是 `event.detail` 则不填
* modelMap.xxx: `Object` 变更  特定组件的 `v-model` 特殊配置项 xxx 表示组件具体标签
    * modelMap.xxx.eventType: `string` 必填 事件类型
    * modelMap.xxx.attrName: `string` 必填 对应 `props` 的属性名
    * modelMap.xxx.detailName: `string` 选填 `event.detail` 上的字段值的 `key`，如果是 `event.detail` 则不填

如果有以下任一情况可进行自定义配置来支持 `v-model`

* 想进行 `v-model` 绑定的 `props` 值并非 `value`
* 对应的事件类型并非 `change`
* 想获取的 `event.detail` 并非 `event.detail` 本身 而是里面的某一属性值

如 `sp-model-component` 组件

```
<template>
    <view class="sp-model-component-wrap">
        <view if="show">
            <view @click="close">关闭</view>
            <text>content</text>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        show: Boolean
    },
    methods: {
        close(event) {
            this.$emit('spchange', {
                show: false
            });
        }
    }
}
</script>
<style lang="stylus">
// ...
</style>
```

直接写是不生效的

```
// 不生效
<sp-model-component v-model="componentVal" />
```

分析可知 对应的取值

- 属性名: `show`
- 事件类型：`spchange`
- `event.detail`：属性为 `show` 的值

因此在 `x.config.js` 加上如下配置， 可使 `v-model` 写法生效

```js
{
    template: {
        modelMap: {
            'sp-model-component': {
                // 必填 事件类型
                eventType: 'spchange',
                // 必填 对应 props 的属性名
                attrName: 'show',
                // 选填 event.detail 上的字段值的key，如果是 event.detail 则不填
                detailName: 'show'
            }
        }
    }
}

```

```
// 生效
<sp-model-component v-model="componentVal" />
```
