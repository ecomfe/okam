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
            let value = ['okam-text'];
            this.selectable && value.push('okam-text-selectable');
            return value;
        }
    }
};
</script>
<style lang="stylus">
.okam-text
    user-select: none
.okam-text-selectable
    user-select: text
</style>

