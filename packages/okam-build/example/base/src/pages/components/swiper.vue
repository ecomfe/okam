<template>
    <view class="swiper-component-wrap">
        <!-- <swiper class="swiper" @change="onChangeManual">
            <swiper-item v-for="item in imgUrls" :key="item">
                <image :src="item" class="slide-image" style="width: 100%" />
            </swiper-item>
        </swiper> -->
        <swiper class="swiper"
            :indicatorDots="true"
            indicatorColor="#ccc"
            indicatorActiveColor="#1AAD19"
            :autoplay="autoPlay"
            :current="currentIdx"
            :display-multiple-items="1"
            :interval="interval"
            :duration="1000"
            :circular="true"
            previous-margin="10px"
            next-margin="10px"
            @change="onChangeAuto"
        >
            <swiper-item v-for="item in imgUrls" :key="item">
                <image :src="item" class="slide-image" style="width: 100%" />
            </swiper-item>
        </swiper>
        <swiper class="swiper"
            :vertical="true"
            :indicatorDots="true"
            indicatorActiveColor="#fff"
            :display-multiple-items="2"
            :autoplay="autoPlay"
            :circular="true"
            next-margin="10px"
            @change="onChangeAuto2"
        >
            <swiper-item v-for="item in imgUrls" :key="item">
                <image :src="item" class="slide-image" style="width: 100%" />
            </swiper-item>
        </swiper>
        <view>
            <button @click="toggleAutoPlay">Toggle Autoplay</button>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Swiper Component'
    },

    data: {
        imgUrls: [
            'http://img5.imgtn.bdimg.com/it/u=3943723512,1898909937&fm=26&gp=0.jpg',
            'http://img3.imgtn.bdimg.com/it/u=3782685451,3066622536&fm=26&gp=0.jpg',
            'http://img0.imgtn.bdimg.com/it/u=3272199364,3404297250&fm=26&gp=0.jpg',
            // 'http://img2.imgtn.bdimg.com/it/u=2682247153,4259400185&fm=26&gp=0.jpg',
            // 'http://www.qnong.com.cn/uploadfile/2016/0416/20160416101826914.jpg',
            // 'http://img3.imgtn.bdimg.com/it/u=2116894832,602371176&fm=27&gp=0.jpg'

        ],
        currentIdx: 0,
        interval: 2000,
        autoPlay: false,
        msg: ''
    },

    methods: {
        toggleAutoPlay() {
            this.autoPlay = !this.autoPlay;
        },

        onChangeManual(e) {
            console.log('manual change...', e);
            this.msg = 'manual: ' + JSON.stringify(e.detail);
        },

        onChangeAuto(e) {
            console.log('auto change...', e);
            this.msg = 'auto: ' + JSON.stringify(e.detail);
        },

        onChangeAuto2(e) {
            console.log('display multiple auto change...', e);
            this.msg = 'auto: ' + JSON.stringify(e.detail);
        }
    }
};
</script>
<style lang="stylus">
.swiper-component-wrap
    padding: 20px
    background: #fff

    .swiper
        margin: 20px 0

    .result-msg
        padding: 20px 0
        color: #888
        word-break: break-all
</style>
