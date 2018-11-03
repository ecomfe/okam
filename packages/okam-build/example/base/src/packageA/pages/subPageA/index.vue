<template>
    <article class="home-wrap">
        <h1 class="page-title">分包页面A</h1>
    </article>
</template>
<script>
export default {
    config: {
        navigationBarTitleText: 'Hello Okam Smart Program',
        backgroundColor: '#fff'
    },
    data: {},
    created() {
        this.$api.showToast({
            title: '123',
            duration: 3000
        });
    }
};
</script>
<style lang="stylus">
html, body
    font-size: 14px;
    height: 100%
    min-height: 100%
    background-color: #ffffff
    color: #333333
</style>
