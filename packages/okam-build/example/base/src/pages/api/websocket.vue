<template>
    <view class="websocket-wrap">
        <view class="input-form">
            <input class="input" type="text" v-model="socketUrl" placeholder="输入要连接的Socket服务器">
            <button plain class="op-btn" type="button" @click="connectSocket">Connect</button>
            <button plain class="op-btn" type="button" @click="closeSocket">Close</button>
        </view>
        <view class="input-form">
            <input class="input" type="text" v-model="sendMsg" placeholder="输入要发送的消息">
            <button plain class="op-btn" type="button" @click="sendMessage">Send</button>
            <button plain class="op-btn" type="button" @click="clearLog">清理日志</button>
        </view>
        <view class="result-msg">
            <view class="msg-item" v-for="item in msgList">{{item}}</view>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'websocket'
    },

    data: {
        socketUrl: 'wss://echo.websocket.org',
        sendMsg: '',
        msgList: []
    },

    methods: {
        connectSocket() {
            this.ws = this.$api.connectSocket({
                url: this.socketUrl,
                complete: res => {
                    this.msgList.push(`Connect Done: ${JSON.stringify(res)};`);
                }
            });

            this.ws.onError(res => {
                this.msgList.push(`Socket error: ${JSON.stringify(res)};`);
            });

            this.ws.onClose(res => {
                this.msgList.push(`Socket close: ${JSON.stringify(res)};`);
            });

            this.ws.onOpen(res => {
                this.msgList.push(`Socket open: ${JSON.stringify(res)};`);
            });

            this.ws.onMessage(res => {
                this.msgList.push(`Received message: ${JSON.stringify(res)};`);
            });
        },

        closeSocket() {
            this.ws.close({
                reason: 'close by okam',
                complete: res => {
                    this.msgList.push(`Close Socket Done: ${JSON.stringify(res)};`);
                }
            });
            this.ws = null;
        },

        sendMessage() {
            if (!this.ws) {
                console.log('please connect first');
                return;
            }
            this.ws.send({
                data: this.sendMsg + ': ' + Date.now(),
                complete: res => {
                    this.msgList.push(`Send Message Done: ${JSON.stringify(res)};`);
                }
            });
            // this.$api.sendSocketMessage({
            //     data: this.sendMsg + ': ' + Date.now(),
            //     complete: res => {
            //         this.msgList.push(`Send Message Done: ${JSON.stringify(res)};`);
            //     }
            // });
        },

        clearLog() {
            this.msgList = [];
        }
    }
};
</script>
<style lang="stylus">
.websocket-wrap
    padding: 20px
    background: #fff

    .input-form
        padding: 20px 0

    .input
        width: 100%
        height: 40px

    .op-btn
        width: 100%
        height: 50px
        margin: 20px auto

    .result-msg
        padding: 20px 0
        color: #888
        word-break: break-all

    .msg-item
        padding-bottom: 10px
        margin-bottom: 10px
        border-bottom: 1px solid #ccc

</style>
