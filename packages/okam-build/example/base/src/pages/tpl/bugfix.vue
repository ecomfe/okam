<template>
    <article class="home-wrap">
        <div
            :style="[
                {
                    color: colorStyle,
                    fontSize: fontStyle + 'px'
                },
                {
                    fontWeight: isWider
                        ? 'bold'
                        : ''
                }]"
            :class="showClass
                ? 'demo'
                : ''"
        >
            标签
        </div>
    </article>
</template>
<script>

export default {
    config: { // The page config defined in page.json
        navigationBarTitleText: 'Bugfix',
        backgroundColor: '#fff'
    },

    data: {
        fontStyle: 30,
        colorStyle: '#f00',
        isWider: true,
        showClass: true
    }
};
</script>
<style lang="stylus">
.home-wrap
    font-size: 14px;
    height: 100%
    min-height: 100%
    background-color: #ffffff
    color: #333333
    padding: 10px 20px
    
</style>
