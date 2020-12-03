<template>
    <div
        class="okam-image"
        :style="styleValue"
    />
</template>
<script>
import {uuid, throttle} from './common/util';

const MODE_STYLE_MAP =  {
    'scaleToFill': {
        backgroundSize: '100% 100%'
    },
    'aspectFit': {
        backgroundSize: 'contain',
        backgroundPosition: 'center center'
    },
    'aspectFill': {
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
    },
    'widthFix': {
        backgroundSize: '100% auto'
    },
    'top': {
        backgroundPosition: 'center top'
    },
    'bottom': {
        backgroundPosition: 'center bottom'
    },
    'center': {
        backgroundPosition: 'center center'
    },
    'left': {
        backgroundPosition: 'left center'
    },
    'right': {
        backgroundPosition: 'right center'
    },
    'top left': {
        backgroundPosition: 'left top'
    },
    'top right': {
        backgroundPosition: 'right top'
    },
    'bottom left': {
        backgroundPosition: 'left bottom'
    },
    'bottom right': {
        backgroundPosition: 'right bottom'
    }
};

function isFixWidthMode(mode) {
    return mode === 'widthFix';
}

export default {
    props: {
        src: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            default: 'scaleToFill'
        },
        lazyLoad: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        styleValue() {
            let style = this.lazyLoad
                ? {}
                : {backgroundImage: `url(${this.src})`};
            return Object.assign(style, {
                backgroundRepeat: 'no-repeat'
            }, MODE_STYLE_MAP[this.mode]);
        }
    },

    watch: {
        src() {
            this.loaded = false;
            this.addScrollListener();
            this.tryLoadImage();
        },
        mode(val) {
            this.fixWidthModeImageHeight(val);
        }
    },

    mounted() {
        this.addScrollListener();
        this.tryLoadImage();
    },

    destroyed() {
        this.removeScrollListener();
    },

    methods: {
        allowLoadImage() {
            if (!this.lazyLoad) {
                return true;
            }

            let el = this.$el;
            let {top, left, right, bottom} = el.getBoundingClientRect();
            let allow = top <= window.innerHeight
                && bottom > 0
                && left < window.innerWidth
                && right > 0;

            if (allow) {
                el.style.backgroundImage = `url(${this.src})`;
            }

            return allow;
        },

        tryLoadImage() {
            if (this.loaded || !this.allowLoadImage()) {
                return;
            }

            this.loaded = true;
            this.removeScrollListener();

            // reset img width/height
            this.rawImgWidth = null;
            this.rawImgHeight = null;

            let reqId = uuid();
            this.reqId = reqId;

            let img = new Image();
            img.onerror = this.onError.bind(this, reqId);
            img.onload = this.onLoad.bind(this, reqId);
            img.src = this.src;
        },

        onError(reqId, e) {
            if (reqId !== this.reqId) {
                return;
            }

            this.$emit('error', {
                errMsg: `GET ${this.src} fail`
            });
        },

        onLoad(reqId, e) {
            if (reqId !== this.reqId) {
                return;
            }

            let {width, height} = e.target;
            this.rawImgWidth = width;
            this.rawImgHeight = height;

            this.fixWidthModeImageHeight(this.mode);
            this.$emit('load', {
                detail: {
                    width,
                    height
                }
            });
        },

        fixWidthModeImageHeight(mode) {
            let el = this.$el;
            if (isFixWidthMode(mode)) {
                if (!this.rawImgWidth) {
                    return;
                }

                // cache the original container height to reset when mode change
                this.rawHeight = el.style.clientHeight;
                let newHeight = Math.floor(
                    el.clientWidth * this.rawImgHeight / this.rawImgWidth
                );
                el.style.height = `${newHeight}px`;
            }
            else if (this.rawHeight) {
                // reset container height
                el.style.height = `${this.rawHeight}px`;
            }
        },

        addScrollListener() {
            if (this.lazyLoad && !this.scrollHandler) {
                this.scrollHandler = throttle(
                    this.onScroll.bind(this), 50
                );
                window.addEventListener('scroll', this.scrollHandler);
            }
        },

        removeScrollListener() {
            if (this.scrollHandler) {
                window.removeEventListener('scroll', this.scrollHandler);
                this.scrollHandler = null;
            }
        },

        onScroll() {
            this.tryLoadImage();
        }
    }
};
</script>
<style lang="stylus">
.okam-image
    position relative
    display inline-block
    overflow hidden
    width 300px
    height 225px
</style>

