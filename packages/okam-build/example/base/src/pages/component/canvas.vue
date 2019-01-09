<template>
    <view class="home-wrap">
        <button class="click-btn" @click="handleClicked">You click me~</button>
        <canvas
            canvas-id="myCanvas"
            class="canvas-test"
            @touchstart="canvasStart"
            @touchend="canvas"
            @touchmove="mvcan">
        </canvas>
        <textarea
            :placeholder="placeholder"
            placeholder-style="color: #000"
            @blur="bindTextAreaBlur"></textarea>
    </view>
</template>
<script>

export default {
    config: {
        title: 'Canvas'
    },

    components: {
    },

    data: {
        placeholder: '文字颜色为黑色，请输入内容',
        btnText: 'Hello'
    },

    mounted: function (e) {
        let context = this.$api.createCanvasContext('myCanvas')

        context.stroke();
        context.setStrokeStyle('#ff0000');
        context.setLineWidth(2);
        context.moveTo(160, 100);
        context.arc(100, 100, 60, 0, 2 * Math.PI, true);
        context.moveTo(140, 100);
        context.arc(100, 100, 40, 0, Math.PI, false);
        context.moveTo(85, 80);
        context.arc(80, 80, 5, 0, 2 * Math.PI, true);
        context.moveTo(125, 80);
        context.arc(120, 80, 5, 0, 2 * Math.PI, true);
        context.stroke();
        context.draw();
    },

    methods: {
        handleClicked(e) {
            this.$api.showToast({
                title: 'clicked',
                duration: 3000
            });
        },
        bindTextAreaBlur() {
            console.log('bindTextAreaBlur');
        },
        canvas(e) {
            console.log('canvas-events');
        },
        mvcan(e) {
            console.log('canvas-mvcan');
        },
        canvasStart() {
            console.log('canvas-start');
        }
    }
};
</script>
<style lang="stylus">
.home-wrap
    box-sizing: border-box
    padding: 20px
    height: 100vh

    .click-btn
        color: red

    textarea,
    .canvas-test
        margin-top: 10px
        box-sizing: border-box
        width: 100%
        background: #f0f0f0

    .canvas-test
        height: 210px

    textarea
        border: 1px solid #000
        background: #fff

</style>

