<template>
    <view class="filter-comp-wrap">
        {{from}}
    </view>
</template>

<script>
export default {
    props: {
        from: String
    },

    methods: {
    }
};
</script>

<style lang="stylus">
.filter-comp-wrap
    padding: 10px
    border: 1px solid #ccc

</style>
