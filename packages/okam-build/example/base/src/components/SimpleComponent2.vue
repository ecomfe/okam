<template>
    <view class="simple-component-wrap2">
        {{text}}
    </view>
</template>
<script>

export default {
    data: {
        text: 'simple component2'
    },
    mounted() {
        console.log('simple component2 mounted', this);
    },
    methods: {
        hello() {
            console.log('hello...')
        }
    }
}
</script>
<style lang="stylus">
.simple-component-wrap2
    padding: 20px
    margin: 20px
    border: 1px solid #ccc
    background: #fff
</style>
