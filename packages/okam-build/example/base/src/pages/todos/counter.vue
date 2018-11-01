<template>
    <view class="my-counter-wrap">
        <counter @counterChange="handleCounterChange"></counter>
    </view>
</template>

<script>
import Counter from '../../components/Counter';

export default {
    config: { // The page config defined in page.json
        navigationBarTitleText: 'Counter',
        backgroundColor: '#fff'
    },

    components: {
        Counter
    },

    methods: {
        handleCounterChange() {
            console.log('counter change...', arguments)
        }
    }
};
</script>
<style lang="stylus">
.my-counter-wrap
    min-height: 100vh
    padding: 20px
    box-sizing: border-box
    background: #fff
</style>
