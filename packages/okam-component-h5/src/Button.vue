<template>
    <button :class="classNames" :disabled="disabled" :type="formType"
        @click="onClick"
        @touchstart="onTouchstart" @touchend="onTouchend">
        <i class="weui-loading" v-if="loading"/>
        <slot></slot>
    </button>
</template>
<script>
import classnames from 'classnames';

const NO_HOVER_CLASS = 'none';

export default {
    props: {
        size: {
            type: String,
            default: 'default'
        },
        type: {
            type: String,
            default: 'default'
        },
        plain: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        formType: String,
        hoverClass: { // pass `none` no clicked style
            type: String,
            default: 'button-hover'
        },
        hoverStartTime: {
            type: Number,
            default: 20
        },
        hoverStayTime: {
            type: Number,
            default: 70
        }
    },

    data() {
        return {
            hover: false
        };
    },

    computed: {
        classNames() {
            let plain = this.plain;
            let disabled = this.disabled;
            let type = this.type;
            let hoverClass = this.hoverClass || '';
            return classnames(
                'weui-btn',
                {
                    [`${hoverClass}`]: this.hover && this.hasHoverClass(),
                    [`weui-btn_plain-${type}`]: plain,
                    [`weui-btn_${type}`]: !plain && type,
                    'weui-btn_mini': this.size === 'mini',
                    'weui-btn_loading': this.loading,
                    'weui-btn_disabled': disabled
                }
            );
        }
    },

    beforeDestroy() {
        this.clearTimers();
    },

    methods: {
        clearTimers() {
            clearTimeout(this.showHoverTimer);
            clearTimeout(this.hideHoverTimer);
        },

        hasHoverClass() {
            return !this.disabled && this.hoverClass
              && (this.hoverClass !== NO_HOVER_CLASS);
        },

        onTouchstart(e) {
            this.$emit('touchstart', e);
            let hasHoverState = this.hasHoverClass();
            if (!hasHoverState) {
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
            let hasHoverState = this.hasHoverClass();
            if (!hasHoverState) {
                return;
            }

            this.hideHoverTimer = setTimeout(
                () => (this.hover = false),
                this.hoverStayTime
            );
        },

        onClick(e) {
            this.$emit('click', e);
        }
    }
}
</script>

<style scoped>
/* .button-hover {
    background-color: rgba(0, 0, 0, 0.1);
    opacity: 0.7;
} */
</style>
