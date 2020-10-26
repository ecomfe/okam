<template>
    <view class="web-view-wrap">
        <web-view :src="src"></web-view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            src: 'https://smartprogram.baidu.com'
        }
    }
}
</script>

<style lang="stylus">
</style>

