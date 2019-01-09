<template>
    <view class="tpl-reuse-wrap">
        <import src="../../common/tpl/footer.tpl"/>
        <view class="main"></view>
        <tpl is="page-footer" :data="{copyRightDate: copyRightDate}" />
        <include src="../../common/tpl/include.tpl"/>
    </view>
</template>

<script>
const now = new Date();
export default {
    config: {
        title: '模板复用'
    },
    data: {
        from: 'Jack',
        copyRightDate: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
    }
};
</script>

<style lang="stylus">
.tpl-reuse-wrap
    position: relative
    height: 100vh
    background: #ccc

    .page-footer
        position: absolute
        bottom: 30px
        left: 0
        right: 0
        width: 100%
        padding: 20px 0
        text-align: center

</style>
