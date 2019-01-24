<template>
    <view class="native-page">
         <view class="title">wxs 组件</view>
         <comp></comp>
    </view>
</template>

<script>

import Comp from '../components/WxComp/index';

export default {
    config: {
        title: 'Native 组件支持'
    },

    components: {
        Comp
    },

    data: {
        str: 'xXws'
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
