<template>
    <view class="data-html-wrap">
        <view class="example-item">
            <view class="sub-title">原生 rich-text 支持</view>
            <rich-text :nodes="divTag">inner</rich-text>
            <rich-text :nodes="aTag" @click="handle"></rich-text>
            <rich-text :nodes="viewTag"></rich-text>
            <rich-text :nodes="imgTag" @click="handle"></rich-text>
            <rich-text :nodes="text"></rich-text>
            <ant-env>
                <view>支付宝不支持 string 类型</view>
            </ant-env>
        </view>
        <view class="example-item">
            <view class="sub-title">v-html 支持</view>
            <div v-html="divTag">inner</div>
            <view v-html="divTag"></view>
            <view v-html="aTag" @click="handle"></view>
            <view v-html="viewTag"></view>
            <view v-html="imgTag" @click="handle"></view>
            <view v-html="text"></view>
            <ant-env>
                <view>支付宝不支持 string 类型</view>
            </ant-env>
        </view>
        <view class="example-item">
            <view class="sub-title">v-html 多平台 arrayData 支持</view>
            <div v-html="arrayTag"></div>

            <view class="sub-title">v-html 多平台 string 支持</view>
            <div v-html="nodes"></div>
        </view>
    </view>
</template>

<script>
import ModelComponent from '../../components/ModelComponent';
import SpModelComponent from '../../components/SpModelComponent';

let htmlData = {
    divTag: '<div class="desc">div 标签</div>',
    aTag: '<a class="link" href="www.baidu.com">a 百度</a><div>div 标签</div>',
    viewTag: '<view class="desc">view 标签</view>',
    imgTag: '<img class="desc" src="https://b.bdstatic.com/searchbox/icms/other/img/ico-share.png" /> img 标签',
    text: '文本'
};


export default {
    config: {
        title: 'v-html支持'
    },
    components: {
    },

    data: {
        divTag: htmlData.divTag,
        aTag: htmlData.aTag,
        viewTag: htmlData.viewTag,
        imgTag: htmlData.imgTag,
        text: htmlData.text,
        arrayTag: [{
          name: 'div',
          attrs: {
            class: 'test_div_class',
            style: 'color: green;'
          },
          children: [{
            type: 'text',
            text: 'Hello&nbsp;World! This is a text node.'
          }]
        }],
        nodes: process.env.APP_TYPE === 'ant' ? [] : htmlData.divTag
    },

    onLoad() {
        if (process.env.APP_TYPE === 'ant') {
            this.$api.htmlToNodes(htmlData.divTag, (err, nodes) => {
                if (!err) {
                    this.setData({nodes});
                    // this.nodes = nodes;
                }
            });
        }
    },

    methods: {
        handle(evt) {
            console.log(evt);
        }
    }
}
</script>

<style lang="stylus">
.data-html-wrap
    position: relative
    padding: 20px
    box-sizing: border-box
    background: #ccc

    .sub-title
        font-size: 28px
        text-align: center
        background: #e0dede
        margin-bottom: 10px

    .example-item
        padding: 10px 15px
        margin: 20px 0
        background: #fff

        .disabled
            color: #ccc
    .desc
        color: #ff4949

    .link
        color: #3c76ff

    .div
        color: #277524
</style>
