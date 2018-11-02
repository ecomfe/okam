<template>
    <view class="simple-component-wrap">
        {{text}}
    </view>
</template>
<script>

export default {
    data: {
        text: 'simple component'
    },

    methods: {
        hello() {
            console.log('hello...')
        }
    }
}
</script>
<style lang="stylus">
.simple-component-wrap
    padding: 20px
    margin: 20px
    border: 1px solid #ccc
    background: #fff
</style>
