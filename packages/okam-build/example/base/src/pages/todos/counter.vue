<template>
    <view class="counter-wrap">
        <view class="counter-title">Counter: {{counter}}</view>
        <button plain class="counter-btn" @click="onAddCounter">增加 Counter</button>
        <button plain class="counter-btn" @click="onMinusCounter">减少 Counter</button>
    </view>
</template>

<script>

export default {
    config: { // The page config defined in page.json
        navigationBarTitleText: 'Counter',
        backgroundColor: '#fff'
    },

    data: {
    },

    computed: {
    },

    $store: {
        computed: ['counter'],
        actions: {
            addCounter(value = 1) {
                console.log('add', value)
                return {type: 'INCREMENT', value};
            },
            minusCounter(value = 1) {
                return {type: 'DECREMENT', value};
            }
        }
    },

    created() {
        let state = this.$store.getState();
        console.log('created counter', state);
    },

    methods: {
        onAddCounter() {
            this.addCounter(5);
        },

        onMinusCounter() {
            this.minusCounter();
        }
    }
};
</script>
<style lang="stylus">
.counter-wrap
    min-height: 100vh
    padding: 20px
    box-sizing: border-box
    background: #fff

    .counter-title
        font-size: 16px
        font-weight: 600
        padding: 20px
        text-align: center

    .counter-btn
        margin: 20px 0

</style>
