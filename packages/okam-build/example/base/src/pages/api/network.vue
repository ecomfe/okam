<template>
    <view class="network-wrap">
        <view class="network-info"><text>{{netInfo}}</text></view>
        <button plain class="get-btn" type="button" @click="getNetworkStatus">获取网络状态</button>
        <view class="net-status-change-msg">
            {{netStatusChangeMsg}}
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Network API'
    },

    data: {
        netInfo: '',
        netStatusChangeMsg: ''
    },

    mounted() {
        this.$api.onNetworkStatusChange(res => {
            this.netStatusChangeMsg = JSON.stringify(res);
        });
    },

    methods: {
        getNetworkStatus() {
            this.$api.getNetworkType({
                complete: res => {
                    this.netInfo = JSON.stringify(res);
                }
            });
        }
    }
};
</script>
<style lang="stylus">
.network-wrap
    padding: 20px
    background: #fff

    .get-btn
        width: 100%
        height: 50px
        background: #ccc
        margin: 20px auto

    .network-info,
    .net-status-change-msg
        padding: 20px 0
        color: #888
        word-break: break-all
</style>
