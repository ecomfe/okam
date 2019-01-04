<template>
    <view class="native-filter-wrap">
        <import-sjs from="../filters/util.sjs" name="util"></import-sjs>
        <view>{{str}}: {{util.toUpperCase(str)}}</view>
        <view>{{str}}: {{util.toLowerCase(str)}}</view>
        <view>fitler nested {{str}}: {{util.toUpperCase(util.toLowerCase(str))}}</view>
        <view>{{util.info}}</view>
    </view>
</template>

<script>

export default {
    config: {
        title: '原生 Ant Filter 支持'
    },

    data: {
        str: 'aCs'
    },

    methods: {

    }
};
</script>

<style lang="stylus">
.native-filter-wrap
    height: 100vh
    padding: 20px
    background: #fff

</style>
