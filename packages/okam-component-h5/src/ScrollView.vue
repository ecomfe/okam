<template>
    <div :class="classNames" @scroll="onScroll"><slot></slot></div>
</template>
<script>
import {throttle} from './util';

export default {
    props: {
        scrollX: {
            type: Boolean,
            default: false
        },
        scrollY: {
            type: Boolean,
            default: false
        },
        upperThreshold: {
            type: Number,
            default: 50
        },
        lowerThreshold: {
            type: Number,
            default: 50
        },
        scrollTop: [Number, String],
        scrollLeft: [Number, String],
        scrollIntoView: String,
        scrollWithAnimation: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        classNames() {
            let cls = ['okam-scroll-view'];
            if (this.scrollX) {
                cls.push('okam-scroll-view-scrollx');
            }

            if (this.scrollY) {
                cls.push('okam-scroll-view-scrolly');
            }

            return cls;
        }
    },

    watch: {
        scrollTop(val) {
            this.updateScrollPosition(true, val);
        },

        scrollLeft(val) {
            this.updateScrollPosition(false, val);
        },

        scrollIntoView(val) {
            val && this.scrollToElement(val);
        }
    },

    mounted() {
        this.direction = null;
        this.currScrollLeft = 0;
        this.currScrollTop = 0;

        if (this.scrollTop) {
            this.updateScrollPosition(true, this.scrollTop);
        }

        if (this.scrollLeft) {
            this.updateScrollPosition(false, this.scrollLeft);
        }

        if (this.scrollIntoView) {
            this.scrollToElement(this.scrollIntoView);
        }

        this.handleScrollLowerUpper = throttle(
            this.onLowerUpper.bind(this), 10
        );
    },

    methods: {
        updateScrollPosition(isVertical, distance, isOffset) {
            let el = this.$el;
            let name = isVertical ? 'scrollTop' : 'scrollLeft';
            let value = parseInt(distance, 10);
            if (isOffset) {
                el[name] += value;
            }
            else {
                el[name] = value;
            }

            // TODO: animation
        },

        scrollToElement(id) {
            let el = this.$el;
            let elem = el.querySelector(`#${id}`);
            if (!elem) {
                return;
            }

            let {left, top} = elem.getBoundingClientRect();
            let {left: wrapLeft, top: wrapTop} = el.getBoundingClientRect();

            if (this.scrollX) {
                this.updateScrollPosition(false, left - wrapLeft, true);
            }

            if (this.scrollY) {
                this.updateScrollPosition(true, top - wrapTop, true);
            }
        },

        onLowerUpper(e) {
            let scrollX = this.scrollX;
            let scrollY = this.scrollY;
            if (!scrollX && !scrollY) {
                return;
            }

            const {
                deltaX,
                deltaY,
                scrollLeft,
                scrollTop,
                scrollWidth,
                scrollHeight
            } = e;
            const {
                offsetWidth,
                offsetHeight
            } = e.target;

            let isLower = false;
            let isUpper = false;
            let direction;
            let lowerThreshold = this.lowerThreshold;
            let upperThreshold = this.upperThreshold;
            if (scrollX) {
                if (deltaX < 0) { // direction: right
                    direction = 'right';
                    isLower = scrollWidth - offsetWidth - scrollLeft <= lowerThreshold;
                }
                else if (deltaX > 0) { // direction: left
                    direction = 'left';
                    isUpper = scrollLeft <= upperThreshold;
                }
            }

            if (scrollY) {
                if (deltaY < 0) { // direction: bottom
                    direction = 'bottom';
                    isLower = scrollHeight - offsetHeight - scrollTop <= lowerThreshold;
                }
                else if (deltaY > 0) { // direction: top
                    direction = 'top';
                    isUpper = scrollTop <= upperThreshold;
                }
            }

            if (isLower) {
                this.$emit('scrolltolower', {detail: {direction}});
            }

            if (isUpper) {
                this.$emit('scrolltoupper', {detail: {direction}});
            }
        },

        onScroll(e) {
            e.preventDefault();
            e.stopPropagation();

            const oldScrollLeft = this.currScrollLeft;
            const oldScrollTop = this.currScrollTop;
            const {
                scrollLeft,
                scrollTop,
                scrollWidth,
                scrollHeight
            } = e.target;

            const deltaX = oldScrollLeft - scrollLeft;
            const deltaY = oldScrollTop - scrollTop;
            this.currScrollLeft = scrollLeft;
            this.currScrollTop = scrollTop;

            let eventDetail = {
                deltaX,
                deltaY,
                scrollLeft,
                scrollTop,
                scrollWidth,
                scrollHeight
            };
            this.$emit('scroll', {
                detail: eventDetail
            });

            this.handleScrollLowerUpper(
                Object.assign({}, eventDetail, {target: e.target})
            );
        }
    }
};
</script>
<style lang="stylus">
.okam-scroll-view
    -webkit-overflow-scrolling: touch
    &::-webkit-scrollbar
        display: none

.okam-scroll-view-scrollx
    overflow-x: auto
    overflow-y: hidden
    white-space: nowrap

.okam-scroll-view-scrolly
    overflow-x: hidden
    overflow-y: auto
</style>
