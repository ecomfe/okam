<template>
    <view class="model-component-wrap">
        <view>
            特殊的自定义组件prop: {{spvalue}}
        </view>
        <view>
            特殊的自定义组件内部data: {{valueInner}}
        </view>
        <input v-model="valueInner" @input="change"/>
    </view>
</template>
<script>

export default {
    data: {
        valueInner: ''
    },
    props: {
        spvalue: String
    },
    mounted() {
        this.valueInner = this.spvalue;
    },
    methods: {
        change(event) {
            this.$emit('spchange', event.detail);
        }
    }
}
</script>
<style lang="stylus">
.model-component-wrap
    padding: 20px
    margin: 20px
    border: 1px solid #000

    input
        word-break: break-all
        width: 100%
        border: 1px solid #000
</style>
