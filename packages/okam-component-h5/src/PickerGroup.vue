<template>
    <div class="weui-picker__group"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd">
        <div class="weui-picker__mask"></div>
        <div ref="indicator" class="weui-picker__indicator"></div>
        <div ref="content" class="weui-picker__content">
            <div class="weui-picker__item" v-for="item in optionList"
                :key="optionNameKey ? item[optionNameKey] : item">
                {{optionNameKey ? item[optionNameKey] : item}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        optionList: {
            type: Array,
            required: true
        },
        selectedIndex: Number,
        optionNameKey: String,
        columnIndex: {
            type: Number,
            required: true
        },
        normalizeSelectedIndex: Function
    },

    data() {
        return {
            currSelIdx: 0,
            pickerItemHeight: 34,
            indicatorOffsetTop: 34 * 3
        };
    },

    watch: {
        selectedIndex: {
            handler(val) {
                this.currSelIdx = val;
                this.updateScrollY();
            },
            immediate: true
        }
    },

    methods: {

        updateSizeInfo() {
            let indicator = this.$refs.indicator;
            this.indicatorOffsetTop = indicator.offsetTop;
            this.pickerItemHeight = indicator.offsetHeight;

            this.updateScrollY();
        },

        getScrollY() {
            let selItemOffset = this.currSelIdx * this.pickerItemHeight;
            return this.indicatorOffsetTop - selItemOffset;
        },

        updateScrollY(scrollY, enableAnimation) {
            let el = this.$refs.content;
            if (!el) {
                return;
            }

            if (scrollY == null) {
                scrollY = this.getScrollY();
            }

            let transform = `translate3d(0, ${scrollY}px, 0)`;
            let transition = `transform ${enableAnimation ? .3 : 0}s ease`;
            el.style.transform = transform;
            el.style.transition = transition;
        },

        getMoveOffsetY(e) {
            return (e.changedTouches[0].clientY - this.startY);
        },

        onTouchStart(e) {
            e.stopPropagation();
            e.preventDefault();

            this.oldScrollY = this.getScrollY();
            this.startY = e.changedTouches[0].clientY;
        },

        onTouchMove(e) {
            e.stopPropagation();
            e.preventDefault();

            let offsetY = this.getMoveOffsetY(e);
            let scrollY = this.oldScrollY + offsetY;
            this.updateScrollY(scrollY);
        },

        normalizeSelectedIdx(idx) {
            let maxIdx = this.optionList.length - 1;
            if (idx < 0) {
                idx = 0;
            }
            else if (idx > maxIdx) {
                idx = maxIdx;
            }

            if (this.normalizeSelectedIndex) {
                idx = this.normalizeSelectedIndex(this.columnIndex, idx);
            }

            return idx;
        },

        onTouchEnd(e) {
            e.stopPropagation();
            e.preventDefault();

            let offsetY = this.getMoveOffsetY(e);
            let deltaIdx = Math.round(offsetY / this.pickerItemHeight);
            let idx = this.normalizeSelectedIdx(this.currSelIdx - deltaIdx);
            let scrollY;
            if (this.currSelIdx === idx) {
                scrollY = this.oldScrollY;
            }
            else {
                this.currSelIdx = idx;
                this.$emit('change', idx);
            }

            this.updateScrollY(scrollY, true);
        },

        setSelectedIndex(idx) {
            this.currSelIdx = idx;
            this.updateScrollY();
        }
    }
};
</script>
