/**
 * @file HoverStartTime/hoverStayTime support
 * @author sparklewhy@gmail.com
 */

'use strict';

const NO_HOVER_CLASS = 'none';

export default function getHoverMixin(options) {
    return {
        props: {
            hoverClass: { // pass `none` no clicked style
                type: String,
                default: options.defaultHoverClass
            },
            hoverStartTime: {
                type: Number,
                default: options.defaultHoverStartTime
            },
            hoverStayTime: {
                type: Number,
                default: options.defaultHoverStayTime
            }
        },

        data() {
            return {
                hover: false
            };
        },

        beforeDestroy() {
            this.clearTimers();
        },

        methods: {
            getHoverClass() {
                let hoverClass = this.hoverClass;
                if (!this.disabled && hoverClass
                  && (hoverClass !== NO_HOVER_CLASS)) {
                    return hoverClass;
                }
            },

            clearTimers() {
                clearTimeout(this.showHoverTimer);
                clearTimeout(this.hideHoverTimer);
            },

            onTouchstart(e) {
                this.$emit('touchstart', e);
                let hoverClass = this.getHoverClass();
                if (!hoverClass) {
                    return;
                }

                this.clearTimers();
                this.showHoverTimer = setTimeout(
                    () => (this.hover = true),
                    this.hoverStartTime
                );
            },

            onTouchend(e) {
                this.$emit('touchend', e);
                let hoverClass = this.getHoverClass();
                if (!hoverClass) {
                    return;
                }

                this.hideHoverTimer = setTimeout(
                    () => (this.hover = false),
                    this.hoverStayTime
                );
            }
        }
    };
}
