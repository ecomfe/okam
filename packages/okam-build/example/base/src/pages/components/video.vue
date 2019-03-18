<template>
    <view class="video-component-wrap">
        <view class="section">
            <video id="myde" :src="src" controls width="100%" :initialTime="10"
                :poster="poster"
                @play="play" @pause="pause" @fullscreenchange="fullscreen"
                @error="onError" @timeupdate="onTimeUpdate" @waiting="onWaiting"
                @ended="ended" :autoplay="autoplay" :muted="muted"></video>
        </view>
        <view class="btn-area">
            <button @click="next">切换视频地址</button>
        </view>
        <view class="btn-area">
            <button @click="setmuted">设置静音</button>
        </view>
        <view class="btn-area">
            <button @click="setautoplay">切换 autoplay </button>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Video Component'
    },

    data: {
        current: 0,
        srcList: [
            'https://vd3.bdstatic.com/mda-ia8e6q3g23py8qdh/hd/mda-ia8e6q3g23py8qdh.mp4?playlist=%5B%22hd%22%5D&auth_key=1521549485-0-0-d5d042ba3555b2d23909d16a82916ebc&bcevod_channel=searchbox_feed&pd=share',
            'https://vd3.bdstatic.com/mda-ib0u8x1bvaf00qa8/mda-ib0u8x1bvaf00qa8.mp4?playlist=%5B%22hd%22%2C%22sc%22%5D',
            'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4'
        ],
        src: 'http://html5video-player.com/data/images/happyfit2.mp4',
        poster: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
        loop: false,
        muted: false,
        autoplay: true
    },

    methods: {
        play(e) {
            console.log('play', e);
        },
        pause(e) {
            console.log('pause', e);
        },
        fullscreen(e) {
            console.log('fullscreenchange!! 参数是' + JSON.stringify(e));
        },
        ended(e) {
            console.log('ended', e);
            this.next();
        },
        next(e) {
            let list = this.srcList;
            let current = (this.current + 1) % list.length;
            this.src = list[current];
            this.current = current;
        },
        setloop(e) {
            this.loop = !this.loop;
        },
        setmuted(e) {
            this.muted = !this.muted;
        },
        setautoplay(e) {
            this.autoplay = !this.autoplay;
        },
        onError(e) {
            console.log('error', e);
        },
        onTimeUpdate(e) {
            console.log('time update', e);
        },
        onWaiting(e) {
            console.log('waiting...', e);
        }
    }
};
</script>
<style lang="stylus">
.video-component-wrap
    padding: 20px
    background: #fff
</style>
