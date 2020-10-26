<template>
    <video :src="src" :controls="controls" :autoplay="autoplay"
        :poster="poster || ''" :loop="loop" :muted="muted"
        :width="width" :height="height" v-bind="$attrs"
        @timeupdate="onTimeUpdate" @ended="onEnded" @play="onPlay"
        @pause="onPause" @waiting="onWaiting" @error="onError">
        <slot></slot>
        您的浏览器不支持 video 标签
    </video>
</template>
<script>
export default {
    props: {
        width: {
            type: [Number, String],
            default: 300
        },
        height: {
            type: [Number, String],
            default: 225
        },
        src: String,
        duration: Number,
        controls: {
            type: Boolean,
            default: true
        },
        autoplay: {
            type: Boolean,
            default: false
        },
        loop: {
            type: Boolean,
            default: false
        },
        muted: { // whether enable no voice play
            type: Boolean,
            default: false
        },
        initialTime: Number,
        poster: String
        // the following props is not supported currently
        // danmu-list danmu-btn enable-danmu
        // page-gesture direction show-progress
        // show-fullscreen-btn	show-play-btn show-center-play-btn
        // enable-progress-gesture object-fit
        // show-mute-btn title
        // play-btn-position enable-play-gesture
        // auto-pause-if-navigate auto-pause-if-open-native
        // vslide-gesture vslide-gesture-in-fullscreen
    },

    watch: {
        initialTime: 'seek'
    },

    mounted() {
        if (this.initialTime) {
            this.seek(this.initialTime);
        }
    },

    methods: {
        seek(initialTime) {
            this.$el.currentTime = initialTime || 0;
        },

        onTimeUpdate(e) {
            let ele = e.target;
            Object.defineProperty(e, 'detail', {
                enumerable: true,
                value: {
                    duration: ele.duration, // second unit
                    currentTime: ele.currentTime
                }
            });
            this.$emit('timeupdate', e);
        },

        onEnded(e) {
            this.$emit('ended', e);
        },

        onPlay(e) {
            this.$emit('play', e);
        },

        onPause(e) {
            this.$emit('pause', e);
        },

        onWaiting(e) {
            this.$emit('waiting', e);
        },

        onError(e) {
            Object.defineProperty(e, 'detail', {
                enumerable: true,
                value: {errMsg: e.target.error.code}
            });
            this.$emit('error', e);
        }
    }
};
</script>
