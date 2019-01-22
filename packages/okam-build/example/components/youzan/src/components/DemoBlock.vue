<template>
    <view :class="{
            'custom-class': true,
            'demo-block': true,
            'van-clearfix': true,
            'demo-block-padding': padding
    }">
        <view if="title" class="demo-block-title">{{title}}</view>
        <slot />
    </view>
</template>

<script>

export default {

    externalClasses: ['custom-class'],

    props: {
        title: String,
        padding: Boolean
    },

    data: {

    },

    mounted() {

    },

    methods: {

    }
};
</script>

<style lang="stylus">
.demo-block-title
    margin: 0
    font-weight: 400
    font-size: 14px
    color: rgba(69, 90, 100, .6)
    padding: 20px 15px 15px

.demo-block-padding
    padding: 0 15px

    .demo-block-title
        padding-left: 0
</style>
