<template>
    <div class="weui-progress">
        <div class="weui-progress__bar" :style="barStyle">
            <div ref="innerBar" :class="innerBarClassNames" :style="innerBarStyle"></div>
        </div>
        <div v-show="showInfo" class="weui-progress__opr" :style="progressInfoStyle">{{activeWidth}}</div>
    </div>
</template>
<script>
import {unitStyle} from './util';

export default {
    props: {
        percent: Number,
        showInfo: {
            type: Boolean,
            default: false
        },
        borderRadius: {
            type: [Number, String],
            default: 0
        },
        fontSize: {
            type: [Number, String],
            default: 16
        },
        strokeWidth: {
            type: [Number, String],
            default: 6
        },
        activeColor: String,
        color: String,
        backgroundColor: String,
        active: {
            type: Boolean,
            default: false
        },
        activeMode: {
            type: String,
            default: 'backwards'
        }
    },

    data() {
        return {disableActive: true};
    },

    computed: {
        isBackwardActiveMode() {
            return this.activeMode === 'backwards';
        },

        activeWidth() {
            if (this.active && this.disableActive) {
                return '0%';
            }

            let percent = this.percent;
            if (!percent || percent < 0) {
                percent = 0;
            }
            else if (percent > 100) {
                percent = 100;
            }
            return `${percent}%`;
        },

        innerBarClassNames() {
            let classNames = ['weui-progress__inner-bar'];
            if (this.active && !this.disableActive) {
                classNames.push('weui-progress__inner-bar-active');
            }
            return classNames;
        },

        barStyle() {
            let style = {};
            let borderRadius = this.borderRadius;
            if (borderRadius) {
                style.borderRadius = unitStyle(borderRadius);
                style.overflow = 'hidden';
            }

            let strokeWidth = this.strokeWidth;
            if (strokeWidth) {
                style.height = unitStyle(strokeWidth);
            }

            let backgroundColor = this.backgroundColor;
            if (backgroundColor) {
                style.backgroundColor = backgroundColor;
            }

            return style;
        },

        innerBarStyle() {
            let style = {};
            let activeColor = this.activeColor || this.color;
            if (activeColor) {
                style.backgroundColor = activeColor;
            }

            style.width = this.activeWidth;

            return style;
        },

        progressInfoStyle() {
            let style = {};
            let fontSize = this.fontSize;
            if (fontSize) {
                style.fontSize = unitStyle(fontSize);
            }

            return style;
        }
    },

    watch: {
        percent(val) {
            if (this.isBackwardActiveMode) {
                this.disableActive = true;

                clearTimeout(this.animationTimer);
                this.animationTimer = setTimeout(
                    () => (this.disableActive = false), 0
                );
            }
        }
    },

    mounted() {
        this.animationTimer = setTimeout(() => (this.disableActive = false), 0);
        if (this.active) {
            this.activeEndHandler = this.onActiveEnd.bind(this);
            this.$refs.innerBar.addEventListener(
                'transitionend', this.activeEndHandler
            );
        }
    },

    beforeDestory() {
        clearTimeout(this.animationTimer);
        if (this.activeEndHandler) {
            this.$refs.innerBar.removeEventListener(
                'transitionend', this.activeEndHandler
            );
            this.activeEndHandler = null;
        }
    },

    methods: {
        onActiveEnd() {
            this.$emit('activeend', {
                detail: {
                    curPercent: this.percent
                }
            });
        }
    }
};
</script>
<style lang="stylus">
.weui-progress__inner-bar-active
    transition: width 1.5s
</style>

