<template>
    <view class="set-nav-title-wrap">
        <view class="input-form">
            <input class="set-input" type="text" v-model="inputVal" placeholder="输入要设置的标题">
            <button plain class="set-btn" type="button" @click="setNavTitle">设置导航栏标题</button>
        </view>
        <view class="set-result-msg">
            {{msg}}
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'setNavigatorBarTitle'
    },

    data: {
        inputVal: '',
        msg: ''
    },

    methods: {
        setNavTitle() {
            this.$api.setNavigationBarTitle({
                title: '123',
                complete: res => {
                    this.msg = `设置 ${this.inputVal} 结果：${JSON.stringify(res)}`;
                }
            });
        }
    }
};
</script>
<style lang="stylus">
.set-nav-title-wrap
    padding: 20px
    background: #fff

    .input-form
        padding: 20px 0

    .set-input
        width: 100%
        height: 40px

    .set-btn
        width: 100%
        height: 50px
        background: #ccc
        margin: 20px auto

    .set-result-msg
        padding: 20px 0
        color: #888
        word-break: break-all

</style>
