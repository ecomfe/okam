<template>
    <view class="oninit-wrap">
        <view class="oninit-title">生命周期oninit:</view>
        <view class="oninit-item">
            oninitData:
            <text class="orange-color">{{oninitData}}</text>
        </view>
        <view class="oninit-item">
            createdData:
            <text class="orange-color">{{createdData}}</text>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        navigationBarTitleText: '提升性能-onInit'
    },
    data: {
        oninitData: '',
        createdData: ''
    },
    onInit() {
        this.oninitData = 'onInit生命周期赋值';
        console.log('[performance] onInit....$query', this.$query);
        console.log('[performance] onInit....this.$api', this.$api);
        console.log('[performance] onInit....this.$http', this.$http);
    },
    created() {
        console.log('[performance] created....this.$query', this.$query);
        console.log('[performance] created....this.$api', this.$api);
        console.log('[performance] created....this.$http', this.$http);
        this.createdData = 'created生命周期赋值';
    },
    onShow(option) {
        console.log('[oninit] page onShow....');
    },
    onHide() {
        console.log('[oninit] page onHide....');
    },
    onUnload() {
        console.log('[oninit] page onUnload....');
    },
    onReachBottom() {
        console.log('[oninit] page onReachBottom...');
    },
    onPageScroll() {
        console.log('[oninit] page onPageScroll...');
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
