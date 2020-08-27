<template>
    <view class="api-clipboard-wrapper">
        <div>原文本： {{ originData }}</div>
        <div>复制文本： {{ copyText }}</div>

        <button @click="copy">Copy</button>
    </view>
</template>
<script>
export default {
    config: {
        title: 'ClipboardAPI'
    },

    data () {
        return {
            originData: 'Hello Okam!',
            copyText: ''
        }
    },

    methods: {
        copy() {
            const that = this;
            this.$api.setClipboardData({
                data: that.originData,
                success: res => {
                    that.copyText = that.originData;
                    this.$api.showToast({
                        title: '复制成功',
                        icon: 'none'
                    });
                },
                fail: err => {
                    this.$api.showToast({
                        title: '复制失败',
                        icon: 'none'
                    });
                    console.log('setClipboardData fail', err);
                }
            });
        },

    }
};
</script>
<style lang="stylus">
.api-clipboard-wrapper
    padding: 20px
    background: #fff
</style>
