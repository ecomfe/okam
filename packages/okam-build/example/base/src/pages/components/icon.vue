<template>
    <view class="icon-component-wrap">
        <view>
            <text>所有支持的 Icon 类型</text>
            <icon v-for="item in iconTypes" :key="item" :type="item"></icon>
        </view>
        <view>
            <icon type="success" size="48px" color="#ccc" @click="clickMe"></icon>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Icon Component'
    },

    data: {
        msg: '',
        iconTypes: [
            'success',
            'success_no_circle',
            'info',
            'warn',
            'waiting',
            'cancel',
            'download',
            'search',
            'clear'
        ]
    },
    methods: {
        clickMe(e) {
            console.log('click', e);
        }
    }
};
</script>
<style lang="stylus">
.icon-component-wrap
    padding: 20px
    background: #fff
</style>
