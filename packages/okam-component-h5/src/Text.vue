<template>
    <span :class="classNames"><slot></slot></span>
</template>
<script>
export default {
    props: {
        selectable: {
            type: Boolean,
            default: false
        }
        // space and decode props is not supported currently
    },

    computed: {
        classNames() {
            return this.selectable ? 'text text-selectable' : 'text';
        }
    }
};
</script>
<style lang="stylus" scoped>
.text
    user-select: none
.text-selectable
    user-select: text
</style>

