<template>
    <view class="page-detail-wrap">
        <view class="page-top">
            <view class="page-top-text">{{id}}</view>
        </view>
        <button @click="navigateBack" type="primary">
            返回上一页
        </button>         
    </view>
</template>
<script>
export default {
    config: {
        navigationBarTitleText: '页面事件'
    },
    data: {
        id: ''
    },
    methods: {
        navigateBack(e) {
            this.$api.navigateBack({
                delta: 2
            });
        }
    },
    created() {
        this.id = this.$query.id;
        console.log('[detail] page created....id', this.id);
    },
    onShow(option) {
        console.log('[detail] onshow....getCurrentPages>>>>', getCurrentPages());
    }
};
</script>
<style lang="stylus">
.page-detail-wrap
    display flex
    flex-direction column
    padding 20px
</style>
