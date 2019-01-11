<template>
    <view class="model-component-wrap">
        <view>
            自定义组件内部prop: {{value}}
        </view>
        <view>
            自定义组件内部data: {{valueInner}}
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
        value: String
    },
    mounted() {
        this.valueInner = this.value;
    },
    methods: {
        change(event) {
            this.$emit('change', event.detail.value);
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
