<template>
    <view class="scroll-api-wrap">
        <view class="box1"></view>
        <view class="box2"></view>
        <view class="box3"></view>
        <button plain class="op-btn" @click="scrollToTop">GotoTop</button>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Scroll'
    },

    data: {
    },

    methods: {
        scrollToTop() {
            this.$api.pageScrollTo({
                scrollTop: 0,
                duration: 300,
                success(res) {
                    console.log('scroll success', res);
                },
                complete(res) {
                    console.log('scroll complete', res);
                }
            });
        }
    }
};
</script>
<style lang="stylus">
.scroll-api-wrap
    padding: 20px
    background: #fff

    .op-btn
        width: 100%
        height: 50px
        margin: 20px auto

    .box1,
    .box2,
    .box3
        height: 300px
        border: 1px solid #ccc
        margin: 20px 0

    .box1
        background-color: red

    .box2
        background-color: blue

    .box3
        background-color: #000

</style>
