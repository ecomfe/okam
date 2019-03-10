<template>
    <view class="scrollview-component-wrap">
        <view class="section section_gap">
            <view class="section__title">vertical scroll</view>
            <scroll-view
                scroll-y
                scrollWithAnimation
                style="height: 200px;"
                class="scroll-view_V"
                @scrolltoupper="upper"
                @scrolltolower="lower"
                @scroll="scroll"
                :scrollIntoView="toView"
                :scrollTop="scrollTop">
                <view id="green" class="scroll-view-item bc_green"></view>
                <view id="red" class="scroll-view-item bc_red"></view>
                <view id="yellow" class="scroll-view-item bc_yellow"></view>
                <view id="blue" class="scroll-view-item bc_blue"></view>
            </scroll-view>

            <view class="btn-area">
                <button size="mini" @click="scrollIntoViewV">click me to scroll into view</button>
                <button size="mini" @click="scrollToTop">click me to scroll</button>
            </view>
        </view>
        <view class="section section_gap">
            <view class="section__title">horizontal scroll</view>
            <scroll-view class="scroll-view_H"
                :scrollLeft="scrollLeft"
                :scrollIntoView="toViewH"
                scrollWithAnimation
                @scrolltoupper="upperHorizontal"
                @scrolltolower="lowerHorizontal"
                @scroll="scrollHorizontal"
                scroll-x style="width: 100%;">
                <view id="green2" class="scroll-view-item_H bc_green"></view>
                <view id="red2" class="scroll-view-item_H bc_red"></view>
                <view id="yellow2" class="scroll-view-item_H bc_yellow"></view>
                <view id="blue2" class="scroll-view-item_H bc_blue"></view>
            </scroll-view>
            <view class="btn-area">
                <button size="mini" @click="scrollIntoViewH">click me to scroll into view</button>
                <button size="mini" @click="scrollToLeft">click me to scroll</button>
            </view>
        </view>
    </view>
</template>
<script>

export default {
    config: {
        title: 'ScrollView Component'
    },

    data: {
        toView: '',
        toViewH: '',
        scrollTop: 100,
        scrollLeft: 50
    },

    methods: {
        upper(e) {
            console.log('upper', e);
        },
        lower(e) {
            console.log('lower', e);
        },
        scroll(e) {
            console.log('scroll', e);
        },
        scrollIntoViewV(e) {
            this.toView = 'red';
            this.$nextTick(() => (this.toView = ''));
        },
        scrollToTop(e) {
            this.scrollTop += 20;
        },

        scrollHorizontal(e) {
            console.log('horizontal scroll', e);
        },

        upperHorizontal(e) {
            console.log('horizontal upper', e);
        },

        lowerHorizontal(e) {
            console.log('horizontal lower', e);
        },

        scrollIntoViewH() {
            this.toViewH = 'red2';
            this.$nextTick(() => (this.toViewH = ''));
        },

        scrollToLeft() {
            this.scrollLeft += 30;
        }
    }
};
</script>
<style lang="stylus">
.scrollview-component-wrap
    padding: 20px
    background: #fff

    .section__title
        padding: 20px 0 0
        font-size: 16px
        font-weight: 600

    .scroll-view_V,
    .scroll-view_H
        margin: 20px 0
        border: 1px solid #ccc

    .scroll-view_H
        height: 150px
        white-space: nowrap

    .scroll-view-item,
    .scroll-view-item_H
        height: 150px
        text-align: center

    .scroll-view-item_H
        display: inline-block
        width: 150px

    .bc_green
        background: #98FB98

    .bc_red
        background: #FFB6C1

    .bc_yellow
        background: #FFD700

    .bc_blue
        background: #87CEFA

</style>
