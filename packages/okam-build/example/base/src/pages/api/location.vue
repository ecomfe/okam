<template>
    <view class="location-wrapper">
        <view class="location-btns">
            <button type="primary" @click="getLocationFn">
                获取位置 getLocation
            </button>
            <button type="default" @click="openLocationFn">
                查看位置 openLocation
            </button>
            <div>{{ tip }}</div>
            <pre>{{ msg }}</pre>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: '位置'
    },

    data: {
        tip: '',
        msg: ''
    },

    methods: {
        getLocationFn() {
            this.$api.getLocation({
                success: res => {
                    this.tip = '高精度位置信息';
                    this.msg = res;
                },
                fail: err => {
                    this.tip = '位置服务被拒绝';
                    this.msg = err;
                }
            });
        },
        openLocationFn() {
            this.$api.openLocation({
                latitude: 40.050426,
                longitude: 116.285630,
                name: '百度科技园',
                address: '北京市海淀区西北旺东路10号院(马连洼街道西北旺社区东北方向)',
                scale: 18
            });
        }
    }
};
</script>
<style lang="stylus">
.location-wrapper
    padding 20px
    background #fff
    .location-btns
        button
            margin-bottom 15px

</style>
