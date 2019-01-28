<template>
    <view class="native-page">
        <view class="title">页面导航</view>
        <view for="item in list">
            <navigator class="item nav" :url="item.url">{{item.text}}</navigator>
        </view>

        <view class="title">Native 组件</view>
        <view class="item">
            <hello @hello="handleHello"></hello>
        </view>
        <view class="item">
            <hi></hi>
        </view>
        <view class="item">
            <simple-sfc from="home sfc component"></simple-sfc>
        </view>
    </view>
</template>

<script>
import SimpleSfc from '../components/SimpleSfc';
import Hello from '../components/Hello';
import Hi from '../components/Hi';

export default {
    config: {
        title: 'Native 组件支持'
    },

    components: {
        SimpleSfc,
        Hello,
        Hi
    },

    data: {
        list: [
            {
                url: '/pages/wxWxs',
                text: '微信wxs'
            },
            {
                url: '/pages/swanFilter',
                text: 'filter'
            },
            {
                url: '/pages/swanNative/index',
                text: '原生swan'
            },
            {
                url: '/pages/wxNative/index',
                text: '原生wx'
            }
        ]
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

.item {
    margin: 10px;
    padding: 10px;
    border: 1px solid #000;
}

.nav {
    color: #03f;
}
</style>
