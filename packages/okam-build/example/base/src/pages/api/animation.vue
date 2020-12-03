<template>
    <view class="animation-wrap">
        <button @click="addAnimation">Animation</button>
        <button @click="addAnimation2">Animation2</button>
        <view
            :animation="animationData"
            style="position: relative; left: 0;background:red;height:100px;width:100px"
        ></view>
    </view>
</template>
<script>
export default {
    config: {
        title: '动画'
    },

    data: {
        animationData: null
    },

    mounted() {
        const animation = this.$api.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
        });

        this.animation = animation;
    },

    methods: {
        addAnimation() {
            const animation = this.animation;

            // animation.scale(2, 2).rotate(45).step();
            animation.rotate(45).left(80).step().left(30).step({
                duration: 500,
                timingFunction: 'ease-in-out'
            });

            this.animationData = animation.export();
            console.log('init', this.animationData)

            // setTimeout(function () {
            //     animation.translate(30).step({
            //         duration: 500,
            //         timingFunction: 'ease-in-out'
            //     });
            //     this.animationData = animation.export();
            //     console.log('after', this.animationData)
            // }.bind(this), 3000);
        },

        addAnimation2() {
            const animation = this.animation;
            animation.translate(30).step({
                duration: 500,
                timingFunction: 'ease-in-out'
            });
            this.animationData = animation.export();
            console.log('after', this.animationData)
        }
    }
};
</script>
<style lang="stylus">
.animation-wrap-wrap
    padding: 20px
    background: #fff
</style>
