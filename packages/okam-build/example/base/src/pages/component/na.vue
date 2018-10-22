<template>
    <view class="na-component-wrap">
        <hello></hello>
    </view>
</template>

<script>
import Hello from '../../components/native/Hello';

export default {
    config: {
        title: '原生组件引用'
    },

    components: {
        Hello
    },

    data: {
    },

    mounted() {
        console.log('mounted...');
    },

    methods: {
    }
};
</script>

<style lang="stylus">
.na-component-wrap
    margin: 10px
    background: #fff
</style>
