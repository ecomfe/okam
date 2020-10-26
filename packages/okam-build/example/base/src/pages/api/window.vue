<template>
    <view class="window-wrap">
        <view class="listen-msg">
            {{listened ? '监听 Resize 中...' : '未监听 Resize'}}
        </view>
        <button plain class="on-btn" type="button" @click="onWindowResize">监听 Window Resize</button>
        <button plain class="off-btn" type="button" @click="offWindowResize">移除 Resize 监听</button>
        <view class="listen-msg">
            {{msg}}
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Window API'
    },

    data: {
        msg: '',
        listened: false
    },

    mounted() {
        this.counter = 1;
        this.resizeHandler = this.handleResize.bind(this);
    },

    methods: {
        handleResize(res) {
            console.log('resize change...', this.counter);
            this.msg = 'change:' + (this.counter++) + ' = ' + JSON.stringify(res);
        },

        onWindowResize() {
            if (this.listened) {
                return;
            }

            this.listened = true;
            this.$api.onWindowResize(this.resizeHandler);
        },

        offWindowResize() {
            if (!this.listened) {
                return;
            }

            this.listened = false;
            this.$api.offWindowResize(this.resizeHandler);
        }
    }
};
</script>
<style lang="stylus">
.window-wrap
    padding: 20px
    background: #fff

    .on-btn,
    .off-btn
        width: 100%
        height: 50px
        background: #ccc
        margin: 20px auto

    .listen-msg
        padding: 20px 0
        color: #888
        word-break: break-all

</style>
