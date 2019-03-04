<template>
    <view class="interaction-wrap">
        <view class="show-toast">
            <button type="primary" @click="showToast">showToast</button>
            <button type="warn" @click="showCustomIconToast">自定义 Icon showToast</button>
            <button type="default" @click="showLoadingToast">Loading showToast</button>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: '交互'
    },

    data: {
    },

    methods: {
        showToast() {
            this.$api.showToast({
                title: '这是 Toast'
            });
        },

        showCustomIconToast() {
            this.$api.showToast({
                title: '自定义 Icon Toast',
                image: require('../../common/img/okam.png')
            });
        },

        showLoadingToast() {
            this.$api.showToast({
                title: 'Loading Toast',
                icon: 'loading'
            });
        }
    }
};
</script>
<style lang="stylus">
.interaction-wrap
    padding: 20px
    background: #fff



</style>
