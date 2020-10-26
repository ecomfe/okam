<template>
    <view class="switch-component-wrap">
        <view class="row"><switch checked @change="onSwitchChange" /></view>
        <view class="row"><switch checked disabled /></view>
        <view class="row"><switch disabled /></view>
        <view class="row"><switch type="checkbox" @change="onSwitchChange" /></view>
        <view class="row"><switch checked type="checkbox" disabled color="#2196F3" /></view>
        <view class="row"><switch color="#2196F3" /></view>
        <view class="result-msg">{{msg}}</view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Switch Component'
    },

    data: {
        msg: ''
    },

    methods: {
        onSwitchChange(e) {
            console.log('change...', e)
            this.msg = 'checked: ' + e.detail.value;
        }
    }
};
</script>
<style lang="stylus">
.switch-component-wrap
    padding: 20px
    background: #fff

    .row
        margin: 20px 0

    .result-msg
        padding: 20px 0
        color: #888
        word-break: break-all
</style>
