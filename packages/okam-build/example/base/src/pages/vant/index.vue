<template>
    <view class="vant-weapp-page">
        <vant-button ref="btn" type="primary" @click="handleClick">按钮</vant-button>
    </view>
</template>

<script>
import button from 'vant-weapp/dist/button';

export default {
    config: {
        title: '有赞UI组件'
    },

    components: {
        'vant-button': button
    },

    data: {
    },

    mounted() {
        console.log('mounted', this.$refs.btn)
    },

    methods: {
        handleClick() {
            console.log('click', arguments);
            console.log(this)
        }
    }
};
</script>

<style lang="stylus">

</style>
