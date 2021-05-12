<template>
    <article class="home-wrap">
        <div
            v-if="isShowA
                && isShowB"
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
            属性内换行兼容
        </div>
        <div
            v-for="item, index in demoArr"
            key="id"
        >
            {{ item.name }}
        </div>
    </article>
</template>
<script>

export default {
    config: { // The page config defined in page.json
        navigationBarTitleText: '属性内换行兼容',
        backgroundColor: '#fff'
    },

    data: {
        fontStyle: 30,
        colorStyle: '#f00',
        isWider: true,
        showClass: true,
        isShowA: true,
        isShowB: true,
        demoArr: [
            {
                name: 'aaa',
                id: 1
            },
            {
                name: 'bbb',
                id: 2
            }
        ]
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
