<template>
    <view class="native-page">
         <view class="title">Native 组件</view>
         <hello @hello="handleHello"></hello>
         <hi></hi>
    </view>
</template>

<script>
import Hello from '../components/Hello';
import Hi from '../components/Hi';

export default {
    config: {
        title: 'Native 组件支持'
    },

    components: {
        Hello,
        Hi
    },

    data: {

    },

    methods: {
        handleHello() {
            console.log('hello', arguments);
        }
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
