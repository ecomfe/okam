# Ref 支持

可以通过在模板定义里使用 `ref` 属性引用自定义组件或者元素节点，在模板所属的页面或者自定义组件上下文，可以通过 `this.$refs` 获取对应的引用实例。如果在 `for` 循环上下文定义 `ref` 属性，则会尝试返回对应的自定义组件数组列表，或者对应的节点引用实例。

**注意：** ~~目前该实现依赖于自定义组件提供的组件查询 API，`支付宝` 小程序暂未提供相应的 API 实现，因此目前只能引用节点，无法获取到对应的组件实例~~（`0.4.0` 版本开始支持支付宝小程序自定义组件 `ref` 引用）。

!> `okam-build@0.4.9` 快应用开始支持，**注意：** 由于底层依赖的快应用实现方案是基于 `$child(componentId)` API 实现，因此要求引用的组件不能存在 `id` 属性否则会冲突，此外，不支持 `for` 循环上下文引用同一组件类型多个组件实例。

## 查询规则

* 如果非 `for` 循环节点引用

    * 基于 `selectComponent` 查询自定义组件实例，如果查询成功，返回对应的组件实例对象；
    * 如果查询失败，~~则基于节点选择器 [select](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.select.html) API 查询，注意该接口不管是否存在对应的节点，都会返回一个 `NodeRef` 对象实例~~ 则返回空

* 如果 `for` 循环节点上下文引用

    * 基于 `selectAllComponents` 查询自定义组件实例，如果存在返回对应的自定义组件实例数组；
    * 如果查询失败，~~则基于节点选择器 [selectorAll](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.selectAll.html) API 查询，注意该接口不管是否存在对应的节点，都会返回一个 `NodeRef` 对象实例，而不是数组~~ 则返回空数组

* 由于小程序底层实现机制，因此是没法拿到非自定义组件的节点实例，要想查询节点的信息，可以通过 `this.createSelectorQuery()`，具体后续操作同[原生 API](https://smartprogram.baidu.com/docs/develop/api/show_query/#createSelectorQuery/)，可以参考后面示例

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
        console.log(this.$refs.forBtn); // undefined
        console.log(this.$refs.forSimpleComponent); // 空数组

        // 非自定义组件节点的查询操作
        let query = this.createSelectorQuery();
        query.select('.my-btn').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec(function (res) {
            res[0].top       // button 节点的上边界坐标
            res[1].scrollTop // 显示区域的竖直滚动位置
        });
    }
};
</script>
```
