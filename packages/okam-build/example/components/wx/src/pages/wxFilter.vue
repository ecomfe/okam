<template>
    <view class="native-filter-wrap">
        <wxs src="../filter/util.wxs" module="util"></wxs>
        <view>{{str}}: {{util.toUpperCase(str)}}</view>
        <view>{{str}}: {{util.toLowerCase(str)}}</view>
        <view>fitler nested {{str}}: {{util.toUpperCase(util.toLowerCase(str))}}</view>
        <view>{{util.info}}</view>
        <wxs module="m1">
        var getMax = function(array) {
            var max = undefined;
            for (var i = 0; i < array.length; ++i) {
                max = max === undefined
                    ? array[i]
                    : (max >= array[i] ? max : array[i]);
            }
            return max;
        }
        module.exports.getMax = getMax;
        </wxs>
        <view>{{m1.getMax(arr)}}</view>
    </view>
</template>

<script>

export default {
    config: {
        title: '原生 Weixin Filter 支持'
    },

    data: {
        str: 'aCs',
        arr: [4, 18, 2]
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
