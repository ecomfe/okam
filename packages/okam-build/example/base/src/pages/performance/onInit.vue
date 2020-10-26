<template>
    <view class="oninit-wrap">
        <view class="oninit-title">生命周期oninit:</view>
        <view class="oninit-item">
            isInit:
            <text class="orange-color">{{isInit}}</text>
        </view>
        <view class="oninit-item">
            setDataInit:
            <text class="orange-color">{{setDataInit}}</text>
        </view>
        <view class="oninit-item">
            获取当前页面查询参数$query: 
            <text class="orange-color">{{query}}</text>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        navigationBarTitleText: '提升性能-onInit'
    },
    data: {
        flag: true,
        height: 100,
        isInit: '',
        setDataInit: false,
        query: null
    },
    onInit(query) {
        console.log('[performance] onInit..............');
        console.log('[performance] onInit $query', this.$query);
        this.isInit = '[onInit] isInit';
        console.log('change isInit.....', this.isInit);
        console.log('[performance] onInit ....重点关注this.$api', this.$api);
        console.log('[performance] onInit this.....关注this.$http之类', this.$http);
    },
    beforeCreate() {
        console.log('page beforeCreate.....');
        console.log('page beforeCreate....重点关注this.$api', this.$api);
        console.log('page beforeCreate....重点关注this.$http', this.$http);
        // this.isInit = '[beforeCreate] isInit';
    },
    created() {
        console.log('page created....');
        console.log('page created....重点关注this.$api', this.$api);
        console.log('page created....重点关注this.$http', this.$http);
        console.log('page created....重点关注this.$http', this.$query);
        this.query = JSON.stringify(this.$query);
        // this.isInit = '[created] isInit';
    },
    onShow(option) {
        // console.log('page onshow getCurrentPages', getCurrentPages());
    },
    onLoad() {
        console.log('page onload....');
    },
    onHide() {
        console.log('page onHide....');
    },
    onUnload() {
        console.log('page onUnload....');
    },
    onReachBottom() {
        console.log('page onReachBottom...');
    },
    onPageScroll() {
        console.log('page onPageScroll...');
    }
};
</script>
<style lang="stylus">
.oninit-wrap
    display flex
    flex-direction column
    padding 20px 20px 50px
    min-height 200px
    color #211e2e
    background #fff

    .oninit-title
        margin-bottom 10px

    .oninit-item
        color #999
        margin-bottom 5px

    .orange-color
        color #ffa500
        margin-left 10px
</style>
