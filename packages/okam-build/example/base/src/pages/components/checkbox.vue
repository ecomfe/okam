<template>
    <view class="checkbox-component-wrap">
        <checkbox-group @change="checkboxChange">
            <label class="checkbox" v-for="item in items" :key="item.name">
                <checkbox :value="item.name" :disabled="item.disabled" :checked="item.checked" color="#2196F3" />
                {{item.value}}
            </label>
        </checkbox-group>
        <view class="result-msg">{{msg}}</view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Checkbox Component'
    },

    data: {
        msg: '',
        items: [
            {name: 'USA', value: '美国', disabled: true},
            {name: 'CHN', value: '中国', checked: true},
            {name: 'BRA', value: '巴西', disabled: true, checked: true},
            {name: 'JPN', value: '日本'},
            {name: 'ENG', value: '英国'},
            {name: 'TUR', value: '法国'},
        ]
    },

    methods: {
        checkboxChange(e) {
            console.log('change...', e)
            this.msg = 'checked: ' + e.detail.value;
        }
    }
};
</script>
<style lang="stylus">
.checkbox-component-wrap
    padding: 20px
    background: #fff
    .result-msg
        padding: 20px 0
        color: #888
        word-break: break-all
</style>
