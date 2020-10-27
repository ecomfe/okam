<template>
    <view class="page-event-wrap">
        <scroll-view class="area1">
            区域A
        </scroll-view>
        <scroll-view class="area2">
            区域B
            <text>(保证大于屏幕的高度，出现下拉框)</text>
        </scroll-view>
        <scroll-view class="area3">
            区域C
        </scroll-view>
    </view>
</template>
<script>
export default {
    config: {
        navigationBarTitleText: '页面事件'
    },
    data: {
        flag: true,
        height: 100
    },
    methods: {

    },
    created() {
        console.log('[page-event] page created....');
    },
    onShow(option) {
        // console.log('page onshow getCurrentPages', getCurrentPages());
    },
    onLoad() {
        console.log('[page-event] page onload....');
    },
    onHide() {
        console.log('[page-event] page onHide....');
    },
    onUnload() {
        console.log('[page-event] page onUnload....');
    },
    onReachBottom() {
        console.log('[page-event] page onReachBottom...');
    },
    onPageScroll() {
        console.log('[page-event] page onPageScroll...');
    }
};
</script>
<style lang="stylus">
.page-event-wrap
    display flex
    flex-direction column
    padding 20px

    .area1
        height 200px
        background-color #6895FF
        text-align center
        line-height 200px

    .area2
        height 1300px
        background-color #8FB1FF
        text-align center
        line-height 1300px

    .area3
        height 200px
        background-color #C3D1FF
        text-align center
        line-height 200px
</style>
