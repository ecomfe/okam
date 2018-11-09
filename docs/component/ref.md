# Ref 支持

可以通过在模板定义里使用 `ref` 属性引用自定义组件或者元素节点，在模板所属的页面或者自定义组件上下文，可以通过 `this.$refs` 获取对应的引用实例。如果在 `for` 循环上下文定义 `ref` 属性，则会尝试返回对应的自定义组件数组列表，或者对应的节点引用实例。

**注意：** 目前该实现依赖于自定义组件提供的组件查询 API，`支付宝` 小程序暂未提供相应的 API 实现，因此目前只能引用节点，无法获取到对应的组件实例。

## 查询规则

* 如果非 `for` 循环节点引用

    * 基于 `selectComponent` 查询自定义组件实例，如果查询成功，返回对应的组件实例对象；
    * 如果查询失败，则基于节点选择器 [select](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.select.html) API 查询，注意该接口不管是否存在对应的节点，都会返回一个 `NodeRef` 对象实例

* 如果 `for` 循环节点上下文引用

    * 基于 `selectAllComponents` 查询自定义组件实例，如果存在返回对应的自定义组件实例数组；
    * 如果查询失败，则基于节点选择器 [selectorAll](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.selectAll.html) API 查询，注意该接口不管是否存在对应的节点，都会返回一个 `NodeRef` 对象实例，而不是数组


## 开启 Ref 支持

在构建配置 `framework` 选项里加上 `ref` 支持：

```
{
    framework: ['ref']
}
```

## 使用示例

```
<template>
<view class="template-ref-syntax-wrap">
    <view>
        <button class="my-btn" ref="myBtn">test button</button>
    </view>
    <view ref="my-view">
        <simple-component ref="myComponent"></simple-component>
    </view>
    <view>
        <button for="item in [1, 2, 3]" ref="forBtn">button-{{item}}</button>
    </view>
    <view>
        <simple-component for="item in [1, 2, 3]" ref="forSimpleComponent">simple-component-{{item}}</simple-component>
    </view>
</view>
</template>
<script>
import SimpleComponent from '../../components/SimpleComponent';
export default {
    config: {
        title: '模板 Ref 属性支持'
    },

    components: {
        SimpleComponent
    },

    data: {
    },

    mounted() {
        console.log(this.$refs['my-btn']); // 返回对应的元素节点信息
        console.log(this.$refs.myComponent); // 返回对应的自定义组件实例
        console.log(this.$refs.forBtn); // 返回元素节点引用对象
        console.log(this.$refs.forSimpleComponent); // 返回自定义组件实例的数组
    }
};
</script>
```
