<template>
    <view class="template-wrap">
        <text class="f-title" if="flag">标题</text>
        <template s-for="item, index in list">
            第{{index}}项内容为{{item}}
        </template>
    </view>
</template>

<script>
export default {
    config: {
        title: 'template做为内标签'
    },

    components: {
        
    },

    data: {
        arr: [1, 2],
        tabs: [{name: 'a1'}],
        flag: true,
        list: ['a', 'b', 'c']
    },

    computed: {
    },

    mounted() {
    },

    methods: {
    }
};
</script>

<style lang="stylus">
.template-wrap
    margin: 20px
    padding: 20px
</style>
