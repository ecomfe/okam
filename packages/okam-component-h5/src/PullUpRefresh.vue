<template>
    <div class="okam-pull-down-refresh" ref="scroller">
        <slot></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isReachBottom: false,
            onReachBottomDistance: 0
        }
    },
    props: {
    },
    mounted() {
        this.scroller = this.$refs.scroller;
        this.isReachBottom = false;
        window.addEventListener('scroll', this.handleScroll);
        this.onReachBottomDistance = window.__currOkamAppInstance.appConfig.onReachBottomDistance || 50;
    },
    methods: {
        handleScroll(e) {
            // console.log('scrollTop>>>>>>>>>>>>>>>>>', window.pageYOffset);
            this.$emit('page-scroll', {
                scrollTop: window.pageYOffset
            });

            // todo: 获取page onReachBottomDistance
            if ((this.scroller.offsetHeight - window.pageYOffset - window.innerHeight) <= 50) {
                if (!this.isReachBottom) {
                    this.isReachBottom = true;
                    this.$emit('reach-bottom', {
                        scrollTop: window.pageYOffset
                    });
                }
            }
            else {
                this.isReachBottom = false;
            }

        }
    }
};
</script>

<style lang="stylus">

</style>