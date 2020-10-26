<template>
    <view class="page-stack-wrap">
        <button @click="navigateTo" type="primary">
            navigateTo跳转到新页面
        </button>
        <button @click="redirectTo" type="primary">
            redirectTo跳转到新页面
        </button>
        <button @click="switchTab" type="primary">
            switchTab跳转到新tabBar页面
        </button>
        <button @click="navigateBack" type="primary">
            navigateBack返回某页面
        </button>
        <button @click="reLaunch" type="primary">
            reLaunch返回某页面
        </button>
    </view>
</template>
<script>
export default {
    config: {
        navigationBarTitleText: '页面栈'
    },
    data: {
    },
    methods: {
        navigateTo(e) {
            this.$api.navigateTo({
                url: '/pages/detail/detail?id=新页面'
            });
        },
        redirectTo(e) {
            this.$api.redirectTo({
                url: '/pages/detail/detail',
                success: res => {
                    console.log('redirectTo success');
                },
                fail: err => {
                    console.log('redirectTo fail', err);
                }
            });
        },
        switchTab() {
            this.$api.switchTab({
                url: '/pages/api/index',
                success: res => {
                    console.log('switchTab success');
                },
                fail: err => {
                    console.log('switchTab fail', err);
                }
            });
        },
        navigateBack(e) {
            this.$api.navigateBack({
                delta: 2
            });
        },
        reLaunch() {
            this.$api.reLaunch({
                url: '/pages/detail/detail?key=value',
                success: res => {
                    console.log('reLaunch success', res);
                },
                fail: err => {
                    console.log('reLaunch fail', err);
                }
            });
        }
    },
    onShow(option) {
        console.log('[page-stack] getCurrentPages>>>>', getCurrentPages());
    }
};
</script>
<style lang="stylus">
.page-stack-wrap
    display flex
    flex-direction column
    padding 20px
</style>
