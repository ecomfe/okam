<template>
    <view class="home-wrap">
        <import src="../../common/tpl/footer.tpl" />
        <view>
            <image class="page-img" src="../../common/img/okm.png" />
            <hello :from="from" @hello="handleHello"></hello>
            <view class="click-tip" if="clicked">You click me~</view>
        </view>
        <tpl is="page-footer"/>
    </view>
</template>
<script>
import Hello from '../../components/OkamHello';

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
    background: #f0f0f0;
}

.home-wrap .click-tip {
    text-align: center;
    color: red;
}
</style>

