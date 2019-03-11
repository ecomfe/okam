<template>
    <div class="weui-slider-box">
        <div class="weui-slider" ref="slider" @click="onSliderClick">
            <div class="weui-slider__inner" :style="sliderInnerStyle">
                <div :style="sliderTrackStyle" class="weui-slider__track"></div>
                <div :style="sliderHandlerStyle" class="weui-slider__handler"
                    @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"></div>
            </div>
        </div>
        <div class="weui-slider-box__value" v-if="showValue">{{currValue}}</div>
    </div>
</template>
<script>
export default {
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        step: {
            type: Number,
            default: 1
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: Number,
            default: 0
        },
        backgroundColor: String,
        activeColor: String,
        blockColor: String,
        blockSize: {
            type: Number,
            default: 28
        },
        showValue: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            currValue: 0
        };
    },

    computed: {
        sliderInnerStyle() {
            let style = {};
            let bgColor = this.backgroundColor;
            bgColor && (style.backgroundColor = bgColor);

            return style;
        },

        sliderTrackStyle() {
            let style = {width: this.percent};
            let activeColor = this.activeColor;
            activeColor && (style.backgroundColor = activeColor);

            return style;
        },

        sliderHandlerStyle() {
            let style = {
                left: this.percent
            };
            let blockColor = this.blockColor;
            if (blockColor) {
                style.backgroundColor = blockColor;
            }

            let blockSize = this.blockSize;
            if (blockSize) {
                blockSize = parseInt(blockSize, 10);
                let width = `${blockSize}px`;
                let offset = blockSize / -2 + 'px';
                style.width = width;
                style.height = width;
                style.marginLeft = offset;
                style.marginTop = offset;
            }

            return style;
        },

        percent() {
            let value = (this.currValue - this.min) / (this.max - this.min) * 100;
            return `${value}%`;
        }
    },

    watch: {
        value: {
            handler(val) {
                this.updateSliderValue(val, 0, 0);
            },
            immediate: true
        }
    },

    mounted() {
        this.startX = 0;
    },

    methods: {
        updateSliderValue(value, startX, endX) {
            let offset = endX - startX;
            if (offset && this.barWidth) {
                let addValue = offset / this.barWidth * (this.max - this.min);
                addValue = Math.round(addValue / this.step) * this.step;
                value += addValue;
            }

            if (value < this.min) {
                value = this.min;
            }
            else if (value > this.max) {
                value = this.max;
            }

            this.currValue = value;
        },

        onTouchStart(e) {
            if (this.disabled) {
                return;
            }

            this.oldValue = this.currValue;
            this.barWidth = this.$refs.slider.clientWidth;
            this.startX = e.changedTouches[0].clientX;
        },

        onTouchMove(e) {
            if (this.disabled) {
                return;
            }

            e.stopPropagation();
            e.preventDefault();

            let endX = e.changedTouches[0].clientX;
            this.updateSliderValue(this.oldValue, this.startX, endX);
            this.$emit('changing', {detail: {value: this.currValue}});
        },

        onTouchEnd(e) {
            if (this.disabled) {
                return;
            }

            let endX = e.changedTouches[0].clientX;
            this.updateSliderValue(this.oldValue, this.startX, endX);
            this.$emit('change', {detail: {value: this.currValue}});
        },

        onSliderClick(e) {
            if (this.disabled) {
                return;
            }

            let {left} = e.target.getBoundingClientRect();
            this.barWidth = this.$refs.slider.clientWidth;
            this.updateSliderValue(this.min, left, e.clientX);
        }
    }
};
</script>
