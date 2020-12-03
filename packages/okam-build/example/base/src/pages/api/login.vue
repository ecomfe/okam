<template>
    <view class="login-wrapper">
        <view class="login-btns">
            <button type="primary" @click="loginFn">
                跳转百度登录 login
            </button>
            <div>{{ tip }}</div>
            <pre>{{ msg }}</pre>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: '登录'
    },

    data: {
        tip: '',
        msg: ''
    },

    methods: {
        loginFn() {
            console.log('跳转登录');
            this.$api.login();
        }
    }
};
</script>
<style lang="stylus">
.login-wrapper
    padding 20px
    background #fff
    .login-btns
        button
            margin-bottom 15px

</style>
