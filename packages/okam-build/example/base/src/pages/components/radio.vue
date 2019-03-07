<template>
    <view class="radio-component-wrap">
        <radio-group @change="radioChange">
            <label class="radio" v-for="item in items" :key="item.name">
                <radio :value="item.name" :disabled="item.disabled" :checked="item.checked" color="#2196F3" />
                {{item.value}}
            </label>
        </radio-group>
        <view class="result-msg">{{msg}}</view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Radio Component'
    },

    data: {
        msg: '',
        items: [
            {name: 'USA', value: '美国', disabled: true},
            {name: 'CHN', value: '中国'},
            {name: 'BRA', value: '巴西', disabled: true, checked: true},
            {name: 'JPN', value: '日本'},
            {name: 'ENG', value: '英国'},
            {name: 'TUR', value: '法国'},
        ]
    },

    methods: {
        radioChange(e) {
            console.log('change...', e)
            this.msg = 'checked: ' + e.detail.value;
        }
    }
};
</script>
<style lang="stylus">
.radio-component-wrap
    padding: 20px
    background: #fff
    .result-msg
        padding: 20px 0
        color: #888
        word-break: break-all
</style>
