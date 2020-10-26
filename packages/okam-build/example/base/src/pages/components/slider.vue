<template>
    <view class="slider-component-wrap">
        <view class="row"><slider :value="value" @change="onSliderChange" @changing="onSliderChanging" /></view>
        <view class="row"><slider :value="value2" backgroundColor="#1AAD19"
            :min="30" :max="150" :step="20"
            activeColor="#2196F3" :blockSize="20" blockColor="#f44336" showValue/></view>
        <view class="row"><slider disabled :value="value" /></view>
        <view class="result-msg">{{msg}}</view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Slider Component'
    },

    data: {
        value: 30,
        value2: 0,
        msg: ''
    },

    methods: {
        onSliderChange(e) {
            console.log('slider change...', e)
            this.msg = 'value: ' + e.detail.value;
        },

        onSliderChanging(e) {
            console.log('slider changing...', e)
            this.msg = 'changing value: ' + e.detail.value;
        }
    }
};
</script>
<style lang="stylus">
.slider-component-wrap
    padding: 20px
    background: #fff

    .row
        margin: 20px 0

    .result-msg
        padding: 20px 0
        color: #888
        word-break: break-all
</style>
