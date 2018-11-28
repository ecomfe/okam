<template>
    <div class="button">
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        plain: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'default'
        },
        type: {
            type: String,
            default: 'default'
        }
    }
};
</script>
<style lang="stylus">
.button
    display: flex
    justify-content: center
    align-items: center
    padding: 0 14px
    font-size: 18px
    text-align: center
    border-radius: 5px
    color: #000000
    background-color: #F8F8F8
</style>
