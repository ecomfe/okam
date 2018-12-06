<template>
    <view class="home-wrap">
        <view class="click-tip">You click me~</view>
    </view>
</template>
<script>

export default {
    config: {
        title: 'Home Page Title'
    },

    components: {
    },

    data: {
        btnText: 'Hello',
        from: 'Okam home page'
    },

    methods: {

        handleHello(e) {
            this.btnText = 'You clicked';

            this.$api.showToast({
                title: 'Received Hello',
                duration: 3000
            });
        }
    }
};
</script>
<style lang="stylus">
@import '../../common/css/b.css'

.home-wrap
    box-sizing: border-box
    height: 100vh
    width: 200px
    background: #f0f0f0

    .click-tip
        text-align: center
        color: red

</style>

