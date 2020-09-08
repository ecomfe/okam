<template>
    <view class="payment-wrapper">
        <view class="payment-btns">
            <button type="primary" @click="payFn">
                跳转收银台支付 requestPolymerPayment
            </button>
            <div>{{ tip }}</div>
            <pre>{{ msg }}</pre>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: '支付'
    },

    data: {
        tip: '',
        msg: ''
    },

    methods: {
        payFn() {
            console.log('跳转支付');
            const payUrl = 'https://etrade.baidu.com/cashier/h5-cashier/?orderId=82781554476245&tpOrderId=670941540232&dealId=856088409&sign=a75aec21d1a8ff96dacaf8f79189e565&appKey=MMUvxG&userId=3400485658&timestamp=2020-09-03%2014%3A31%3A12';
            this.$api.requestPolymerPayment({
                payUrl
            });
        }
    }
};
</script>
<style lang="stylus">
.payment-wrapper
    padding 20px
    background #fff
    .payment-btns
        button
            margin-bottom 15px

</style>
