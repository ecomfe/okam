<template>
    <view class="richtext-component-wrap">
        <view>
            <view>Nodes 对象初始化</view>
            <rich-text :nodes="nodes" @click="onClick"></rich-text>
        </view>
        <view>
            <view>Nodes 字符串初始化</view>
            <rich-text :nodes="nodesStr" @click="onClick"></rich-text>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'RichText Component'
    },

    data: {
        nodes: [{
            name: 'div',
            attrs: {
                class: 'div-class',
                style: 'line-height: 60px; color: red;'
            },
            children: [{
                type: 'text',
                text: 'Hello&nbsp;World!<div>ss</div>'
            }]
        }],
        nodesStr: '<div class="div-class" style="line-height: 60px; color: red;">Hello&nbsp;World!</div>'
    },

    methods: {
        onClick(e) {
            console.log('click...', e);
        }
    }
};
</script>
<style lang="stylus">
.richtext-component-wrap
    padding: 20px
    background: #fff

    .div-class
        border: 1px solid #ccc
</style>
