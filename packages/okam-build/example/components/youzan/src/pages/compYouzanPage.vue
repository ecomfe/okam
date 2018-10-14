<template>
    <view class="comp-page">
        <view class="title">微信自定义组件(youzan)引入</view>
        <van-progress percentage="50" />
        <van-button type="primary">主要按钮</van-button>
    </view>
</template>

<script>
import VanButton from 'vant-weapp/dist/button/index';
import VanProgress from 'vant-weapp/dist/progress/index';

export default {
    config: {
        navigationBarTitleText: '微信自定义组件(youzan)引入'
    },

    components: {
        VanProgress,
        VanButton
    },

    data: {
        active: 0,
        testData: true
    },

    methods: {
    }
};
</script>

<style lang="css">
.title {
    display: block;
    width: 100%;
    color: #f00;
    font-size: 20px;
    text-align: center;
}

</style>
