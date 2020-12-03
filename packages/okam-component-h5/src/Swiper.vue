<template>
    <div
        :class="[
            'okam-swiper',
            vertical ? 'okam-swiper-vertical' : 'okam-swiper-horizontal'
        ]"
    >
        <div
            :style="slideListWrapStyle"
            class="okam-swiper-slidelist-wrap"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
        >
            <div ref="slideList" class="okam-swiper-slidelist">
                <slot></slot>
            </div>
        </div>
        <div
            v-if="indicatorDots"
            class="okam-swiper-indicator"
        >
            <i
                v-for="n in swiperItemNum"
                :class="n | isActiveDot(activeIdx, displayNum, swiperItemNum) | dotClass"
                :style="n | isActiveDot(activeIdx, displayNum, swiperItemNum) | dotStyle(indicatorColor, indicatorActiveColor)"
                :key="n"
            />
        </div>
    </div>
</template>
<script>
export default {
    props: {
        indicatorDots: {
            type: Boolean,
            default: false
        },
        indicatorColor: String,
        indicatorActiveColor: String,
        autoplay: {
            type: Boolean,
            default: false
        },
        current: Number,
        currentItemId: [Number, String],
        interval: {
            type: Number,
            default: 5000
        },
        duration: {
            type: Number,
            default: 500
        },
        circular: {
            type: Boolean,
            default: false
        },
        vertical: {
            type: Boolean,
            default: false
        },
        previousMargin: String,
        nextMargin: String,
        displayMultipleItems: {
            type: Number,
            default: 1
        }
    },

    data() {
        return {
            swiperItemNum: 0,
            activeIdx: -1,
            swipeMovePercent: 0
        };
    },

    computed: {
        prevOffset() {
            return this.previousMargin ? parseInt(this.previousMargin, 10) || 0 : 0;
        },
        nextOffset() {
            return this.nextMargin ? parseInt(this.nextMargin, 10) || 0 : 0;
        },
        displayNum() {
            return this.displayMultipleItems || 1;
        },
        circularEnabled() {
            return this.circular && this.swiperItemNum > this.displayNum;
        },
        swiperItemPercent() {
            return 100 / this.displayNum;
        },
        slideListWrapStyle() {
            let style = {};
            let prev = this.prevOffset;
            let next = this.nextOffset;

            if (this.vertical) {
                prev && (style.top = `${prev}px`);
                next && (style.bottom = `${next}px`);
            }
            else {
                prev && (style.left = `${prev}px`);
                next && (style.right = `${next}px`);
            }

            return style;
        }
    },

    watch: {
        autoplay(val) {
            if (val) {
                this.autoPlaySlide();
            }
            else {
                this.stopAutoPlay();
            }
        },
        activeIdx(val) {
            this.updateSwiperMovePercent(val);
        }
    },

    filters: {
        isActiveDot(n, activeIdx, displayNum, totalNum) {
            // here n is beginning with 1, not 0
            let startActiveNum = activeIdx + 1;
            let endActiveNum = activeIdx + displayNum;
            let extralActive;
            if (endActiveNum > totalNum) {
                extralActive = [1, endActiveNum - totalNum];
                endActiveNum = totalNum;
            }

            let active = n >= startActiveNum && n <= endActiveNum;
            active = (active || (extralActive && n >= extralActive[0] && n <= extralActive[1]));
            return active;
        },

        dotClass(isActive) {
            let value = ['okam-swiper-indicator-dot'];
            isActive && value.push('okam-swiper-indicator-dot-active');
            return value;
        },

        dotStyle(isActive, indicatorColor, indicatorActiveColor) {
            if (isActive) {
                return indicatorActiveColor ? {background: indicatorActiveColor} : {};
            }

            return indicatorColor ? {background: indicatorColor} : {};
        }
    },

    mounted() {
        // init swiper item number
        let children = this.$children;
        this.swiperItemNum = this.$children.length;

        // init active swiper item index
        let activeIdx = this.activeIdx = this.getActiveIndex();

        // init swiper item style
        let isVertical = this.vertical;
        children.forEach(
            (item, index) => this.updateSwiperItemStyle(
                item, index * 100, this.swiperItemPercent
            )
        );

        // init swiper translate percent
        this.updateSwiperMovePercent(activeIdx);
        if (this.circularEnabled) {
            this.updateCircularSwiperLayout(activeIdx);
        }

        // init swiper size
        let sliderListEle = this.$refs.slideList;
        this.slideListContainerSize = isVertical ? sliderListEle.clientHeight : sliderListEle.clientWidth;

        // init auto play
        if (this.autoplay) {
            this.autoPlaySlide();
        }
    },

    beforeDestroy() {
        clearTimeout(this.animationTimer);
        this.stopAutoPlay();
    },

    methods: {
        normalizeActiveIndex(idx) {
            if (!idx) {
                return 0;
            }

            let total = this.swiperItemNum;
            let circular = this.circularEnabled;
            if (circular) {
                if (idx < 0 || idx > total - 1) {
                    idx = idx % total;
                    idx < 0 && (idx += total);
                }
                return idx;
            }

            if (idx < 0) {
                return 0;
            }

            let lastIdx = total - this.displayNum;
            if (idx > lastIdx) {
                return lastIdx;
            }

            return idx;
        },

        getSwipeItemIdByIndex(queryIdx) {
            let id;
            this.$children.some((item, idx) => {
                if (idx === queryIdx) {
                    id = item.itemId;
                    return true;
                }
                return false;
            });
            return id == null ? '' : '' + id;
        },

        getActiveIndex() {
            let currentItemId = this.currentItemId;
            let activeIdx = 0;
            if (currentItemId != null) {
                this.$children.some((item, idx) => {
                    /* eslint-disable eqeqeq */
                    if (item.itemId == currentItemId) {
                        activeIdx = idx;
                        return true;
                    }
                    return false;
                });
            }
            else {
                let current = this.current;
                if (current != null) {
                    activeIdx = parseInt(current, 10);
                }
            }

            return this.normalizeActiveIndex(activeIdx);
        },

        stopAutoPlay() {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        },

        autoPlaySlide() {
            this.autoPlayTimer = setInterval(
                this.showNextSlide.bind(this), this.interval
            );
        },

        updateSwiperItemStyle(swiperItem, percentValue, sizePercentValue) {
            let isVertical = this.vertical;
            let percent = `${percentValue}%`;
            let transform = isVertical ? `translate3d(0, ${percent}, 0)` : `translate3d(${percent}, 0, 0)`;
            let style = {transform};

            if (sizePercentValue) {
                style[isVertical ? 'height' : 'width'] = `${sizePercentValue}%`;
            }

            swiperItem.updateStyle(style);
        },

        updateCircularSwiperLayout(activeIdx, isPrevDirection = false) {
            let displayNum = this.displayNum;
            let total = this.swiperItemNum;
            let swiperItemList = this.$children;

            let nextBufferNum = isPrevDirection ? displayNum : total - displayNum;
            nextBufferNum > displayNum && (nextBufferNum = displayNum);

            let prevBufferNum = total - nextBufferNum - 1 > 0 ? 1 : 0;
            let nextIdx = activeIdx;
            while (nextIdx <= activeIdx + nextBufferNum) {
                let item = swiperItemList[nextIdx % total];
                this.updateSwiperItemStyle(item, nextIdx * 100);
                nextIdx++;
            }

            if (prevBufferNum) {
                let idx = activeIdx - 1;
                let itemIdx = idx < 0 ? (total + idx) : idx;
                let item = swiperItemList[itemIdx];
                this.updateSwiperItemStyle(item, idx * 100);
            }
        },

        updateSlideListStyle(percentValue, enableAnimation) {
            let percent = percentValue + '%';
            let transform = this.vertical ? `translate3d(0, ${percent}, 0)` : `translate3d(${percent}, 0, 0)`;
            let transition = `transform ${enableAnimation ? this.duration : 0}ms`;
            let elem = this.$refs.slideList;
            elem.style.transform = transform;
            elem.style['-webkit-transform'] = transform;
            elem.style.transition = transition;
        },

        triggerActiveSlideChange(source) {
            let current = this.activeIdx;
            this.$emit('change', {
                detail: {
                    current,
                    source,
                    currentItemId: this.getSwipeItemIdByIndex(current)
                }
            });
        },

        updateSwiperMovePercent(activeIdx) {
            this.swipeMovePercent = activeIdx * this.swiperItemPercent * -1;
            this.updateSlideListStyle(this.swipeMovePercent, true);
        },

        showNextSlide() {
            let index = this.activeIdx + 1;
            let total = this.swiperItemNum;
            let sourceType = 'autoplay';
            if (this.circularEnabled) {
                let oldIdx = this.activeIdx;
                index = index % total;
                this.updateCircularSwiperLayout(index);

                // the order is next direction (move left direction in horizontal),
                // prev direction does not happen
                // in auto play mode, so here not need to consider the prev direction
                if (oldIdx === total - 1 && index === 0) {
                    this.updateSlideListStyle(this.swiperItemPercent);
                }
            }
            else {
                let lastIdx = total - this.displayNum;
                index = index > lastIdx ? 0 : index;
            }

            this.animationTimer = setTimeout(() => {
                this.activeIdx = index;
                this.triggerActiveSlideChange(sourceType);
            }, 30);
        },

        resetSwiperState(newIdx, delta) {
            let isActiveIdxChange = newIdx !== this.activeIdx;
            if (this.circularEnabled) {
                this.updateCircularSwiperLayout(newIdx);

                let swiperItemPercent = this.swiperItemPercent;
                delta = delta % swiperItemPercent;

                let total = this.swiperItemNum;
                let lastActiveIdx = this.lastActiveIdx;
                if (lastActiveIdx === total - 1 && newIdx === 0) {
                    // move prev direction: from last one to first one
                    // e.g., move first one right offset < swiperItemPercent * 0.5
                    this.updateSlideListStyle(delta);
                }
                else if (lastActiveIdx === 0 && newIdx === total - 1) {
                    // move next direction: from first one to last one
                    // e.g., move last one left offset < swiperItemPercent * 0.5
                    this.updateSlideListStyle(
                        (1 - total) * swiperItemPercent + delta
                    );
                }
            }

            this.animationTimer = setTimeout(() => {
                if (!isActiveIdxChange) {
                    this.swipeMovePercent = this.oldSwipeMovePercent;
                    this.updateSlideListStyle(this.swipeMovePercent, true);
                }
                else {
                    this.activeIdx = newIdx;
                    this.triggerActiveSlideChange('touch');
                }

                if (this.autoplay) {
                    this.autoPlaySlide();
                }
            }, 30);
        },

        onTouchStart(e) {
            if (e.touches.length >= 2) {
                return;
            }

            this.stopAutoPlay();
            clearTimeout(this.animationTimer);
            this.oldSwipeMovePercent = this.swipeMovePercent;

            let touch  = e.changedTouches[0];
            this.touchStartPosition = {
                x: touch.pageX,
                y: touch.pageY
            };
            this.touchStartTimestamp = Date.now();
            this.lastActiveIdx = this.activeIdx;
        },

        getMoveNextActiveIndex(movePercent, isEnd) {
            let delta = movePercent - this.oldSwipeMovePercent;

            let offsetItemNum = Math[isEnd ? 'round' : 'ceil'](
                Math.abs(delta) / this.swiperItemPercent
            );

            if (isEnd) {
                const startPoint = this.isVertical ? this.touchStartPosition.y : this.touchStartPosition.x;
                const endPoint = this.isVertical ? this.touchEndPosition.y : this.touchEndPosition.x;

                if (Math.abs(startPoint - endPoint) * 1000 / this.touchDuration > 100) {
                    offsetItemNum = 1;
                }
            }
            let isPrevDirection = delta > 0;

            let nextActiveIdx = this.activeIdx + offsetItemNum * (isPrevDirection ? -1 : 1);

            nextActiveIdx = this.normalizeActiveIndex(nextActiveIdx);
            return {
                index: nextActiveIdx,
                delta,
                isPrevDirection
            };
        },

        updateCircularMoveSlideStyle(movePercent) {
            let {
                index: nextActiveIdx,
                isPrevDirection
            } = this.getMoveNextActiveIndex(movePercent);
            this.lastActiveIdx = nextActiveIdx;

            // update swiper layout
            this.updateCircularSwiperLayout(nextActiveIdx, isPrevDirection);

            // update swiper viewport to ensure the slide position correct
            let itemPercent = this.swiperItemPercent;
            let percentDelta = movePercent % this.swiperItemPercent;
            let lastOnePercent = (this.swiperItemNum - 1) * itemPercent * -1;
            if (movePercent > 0) { // prev direction
                this.updateSlideListStyle(
                    (nextActiveIdx + 1) * itemPercent * -1 + percentDelta
                );
            }
            else if (movePercent < lastOnePercent) { // next direction
                this.updateSlideListStyle(
                    (nextActiveIdx - 1) * itemPercent * -1 + percentDelta
                );
            }
            else {
                this.updateSlideListStyle(movePercent);
            }
        },

        onTouchMove(e) {
            if (e.touches.length >= 2) {
                return this.resetSwiperState(this.activeIdx, 0);
            }

            e.stopPropagation();
            e.preventDefault();

            let {pageX, pageY} = e.changedTouches[0];
            let {x: startX, y: startY} = this.touchStartPosition;
            let diff = this.vertical ? pageY - startY : pageX - startX;
            let percent = diff / this.slideListContainerSize * 100;
            this.swipeMovePercent = this.oldSwipeMovePercent + percent;

            const movePercent = this.swipeMovePercent;
            if (this.circularEnabled) {
                this.updateCircularMoveSlideStyle(movePercent);
            }
            else {
                this.updateSlideListStyle(movePercent);
            }
        },

        onTouchEnd(e) {
            if (e.touches.length >= 2) {
                return this.resetSwiperState(this.activeIdx, 0);
            }
            let {
                pageX,
                pageY
            } = e.changedTouches[0];

            this.touchEndPosition = {
                x: pageX,
                y: pageY
            }

            this.touchDuration = Date.now() - this.touchStartTimestamp;
            let {
                index,
                delta
            } = this.getMoveNextActiveIndex(this.swipeMovePercent, true);
            this.resetSwiperState(index, delta);
        }
    }
};
</script>
<style lang="stylus">
.okam-swiper
    position: relative
    width: 100%
    height: 150px
    overflow: hidden
    transform: translateZ(0)

.okam-swiper-slidelist-wrap
    position: absolute
    left: 0
    right: 0
    top: 0
    bottom: 0

.okam-swiper-slidelist
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    will-change: transform

.okam-swiper-indicator
    position: absolute
    z-index: 10
    text-align: center
    transition: .3s background-color
    transform: translate3d(0, 0, 0)
    font-size: 0
    white-space: nowrap

.okam-swiper-indicator-dot
    display: inline-block
    width: 8px
    height: @width
    border-radius: 100%
    background: rgba(0, 0, 0, .3)

.okam-swiper-indicator-dot-active
    background: #000

.okam-swiper-horizontal
    .okam-swiper-indicator
        bottom: 10px
        left: 0
        width: 100%

    .okam-swiper-indicator-dot
        margin: 0 4px

.okam-swiper-vertical
    .okam-swiper-indicator
        top: 50%
        right: 10px
        transform: translate3d(0, -50%, 0)

    .okam-swiper-indicator-dot
        display: block
        margin: 6px 0

</style>
