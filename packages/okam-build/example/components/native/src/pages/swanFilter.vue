<template>
    <view class="native-filter-wrap">
         <filter src="../filter/util.filter.js" module="util"></filter>
         <view>{{str}}: {{util.toUpperCase(str)}}</view>
         <filter module="util2">
            export default {
                toLowerCase(str) {
                    return str.toLowerCase();
                }
            }
         </filter>
         <view>{{str}}: {{util2.toLowerCase(str)}}</view>
         <!-- filter nested is not supported in swan-->
         <!-- <view>filter nested {{str}}: {{ util.toUpperCase(util2.toLowerCase(str)) }}</view> -->
    </view>
</template>

<script>

export default {
    config: {
        title: '原生 Swan Filter 支持'
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
    background: #fff
    padding: 20px
</style>
