<template>
    <div class="okam-web-view">
        <iframe 
            ref="webviewiframe"
            class="webview"
            :src="src"
            frameborder="0"
            allowfullscreen
            allowtransparency
        ></iframe>
    </div>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang="stylus">
.okam-web-view
    position fixed
    width 100%
    height 100%
    top 0
    bottom 0
    left 0
    right 0
    z-index 999
    overflow auto
    -webkit-overflow-scrolling touch

 .webview
    border none
    height 100%
    min-width 100%
    width 100px
    *width 100%
</style>
