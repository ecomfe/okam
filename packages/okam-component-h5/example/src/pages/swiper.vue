<template>
    <div class="component-container">
        <div class="wrap">
            <div class="card-area">
                <swiper
                    class="swiper"
                    :indicator-dots="switchIndicateStatus"
                    indicator-color="rgba(0,0,0,0.30)"
                    indicator-active-color="#fff"
                    :autoplay="switchAutoPlayStatus"
                    :current="0"
                    :current-item-id="0"
                    :interval="autoPlayInterval"
                    :duration="switchDuration"
                    :circular="true"
                    :vertical="switchVerticalStatus"
                    previous-margin="0px"
                    next-margin="0px"
                    :display-multiple-items="1"
                    @change="swiperChange"
                    @animationfinish="animationfinish">
                    <swiper-item
                        v-for="item in swiperList"
                        :key="item.value"
                        :item-id="itemId"
                        :class="item.className">
                        <div class="swiper-item">{{item.value}}</div>
                    </swiper-item>
                </swiper>

                <div class="item-scroll border-bottom">
                    <text class="switch-text-before">指示点</text>
                    <switch
                        class="init-switch"
                        :checked="switchIndicateStatus"
                        @change="switchIndicate">
                    </switch>
                </div>

                <div class="item-scroll border-bottom">
                    <text class="switch-text-before">自动切换</text>
                    <switch
                        :checked="switchAutoPlayStatus"
                        @change="switchAutoPlay"
                        class="init-switch">
                    </switch>
                </div>

                <div class="item-scroll">
                    <text class="switch-text-before">纵向滑动</text>
                    <switch
                        :checked="switchVerticalStatus"
                        @change="switchVertical"
                        class="init-switch">
                    </switch>
                </div>
            </div>
            <div class="card-area">
                <div class="top-description border-bottom">
                    <div>滑块切换时长</div>
                    <div>{{switchDuration}}ms</div>
                </div>
                <slider
                    class="slider"
                    :min="300"
                    :max="1500"
                    :value="switchDuration"
                    @change="changeSwitchDuration">
                </slider>
            </div>
            <div class="card-area">
                <div class="top-description border-bottom">
                    <div>自动切换时间间隔</div>
                    <div>{{autoPlayInterval}}ms</div>
                </div>
                <slider
                    class="slider"
                    :min="1000"
                    :max="5000"
                    :value="autoPlayInterval"
                    @change="changeAutoPlayInterval">
                </slider>
            </div>
        </div>
    </div>
</template>

<script>
import Swiper from 'okam/Swiper';
import SwiperItem from 'okam/SwiperItem'
import Slider from 'okam/Slider';

export default {
    components: {
        Swiper,
        Slider,
        SwiperItem
    },
    data() {
        return {
            swiperList: [
                {
                    className: 'color-a',
                    value: 'A'
                }, {
                    className: 'color-b',
                    value: 'B'
                }, {
                    className: 'color-c',
                    value: 'C'
                }
            ],
            current: 0,
            itemId: 0,
            switchIndicateStatus: true,
            switchAutoPlayStatus: false,
            switchVerticalStatus: false,
            switchDuration: 500,
            autoPlayInterval: 2000
        }
    },
    methods: {
        swiperChange(e) {
            console.log('swiperChange:', e.detail);
            this.itemId = e.detail.current;
        },
        switchIndicate() {
            this.switchIndicateStatus = !this.switchIndicateStatus
        },
        switchVertical() {
            this.switchVerticalStatus = !this.switchVerticalStatus
        },
        switchAutoPlay() {
            this.switchAutoPlayStatus = !this.switchAutoPlayStatus
        },
        changeSwitchDuration(e) {
            this.switchDuration = e.detail.value
        },
        changeAutoPlayInterval(e) {
            this.autoPlayInterval = e.detail.value
        },
        animationfinish(e) {
            console.log(e.type);
        }
    }
};
</script>
<style>
.swiper {
    height: 200px;
}

.swiper-item {
    width: 100%;
    height: 2.18rem;
    font-size: .18rem;
    line-height: 2.18rem;
    text-align: center;
    color: #fff;
}

.slider {
    margin: .3rem .23rem;
}

.switch-text-before {
    margin-top: .17rem;
}

.init-switch {
    vertical-align: middle;
    margin: .14rem 0 .14rem .17rem;
}

.color-a {
    background-color: red;
}

.color-b {
    background-color: yellow;
}

.color-c {
    background-color: green;
}

.switch {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
}
</style>
