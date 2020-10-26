<template>
    <div class="okam-swiper-item"><slot></slot></div>
</template>
<script>
export default {
    props: {
        itemId: [Number, String]
    },

    methods: {
        updateStyle(style) {
            let elem = this.$el;
            Object.keys(style).forEach(k => {
                elem.style[k] = style[k];
            });
        }
    }
};
</script>
<style lang="stylus">
.okam-swiper-item
    position: absolute
    width: 100%
    height: 100%
    will-change: transform
    overflow: hidden
</style>

