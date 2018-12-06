<template>
    <import src="../../common/tpl/footer.tpl" />
    <view class="home-wrap">
        <image class="page-img" src="../../common/img/okm.png" />
        <hello :from="from" @hello="handleHello"></hello>
        <view class="click-tip" if="clicked">You click me~</view>
    </view>
    <tpl is="page-footer" />
</template>
<script>
import Hello from '../../components/Hello';

export default {
    config: {
        title: 'Home Page Title'
    },

    components: {
        Hello
    },

    data: {
        btnText: 'Hello',
        clicked: false,
        from: 'Okam home page'
    },

    methods: {

        handleHello(e) {
            this.clicked = true;
            this.btnText = 'You clicked';

            this.$api.showToast({
                title: 'Received Hello',
                duration: 3000
            });
        }
    }
};
</script>
<style>

@import '../../common/css/common.css';

.home-wrap {
    box-sizing: border-box;
    height: 100vh;
    width: 200px;
    background: #f0f0f0;
}

.home-wrap .click-tip {
    text-align: center;
    color: red;
}
</style>

