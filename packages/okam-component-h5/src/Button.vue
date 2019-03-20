<template>
    <button :class="classNames" :disabled="disabled" :type="formType"
        @click="onClick"
        @touchstart="onTouchstart" @touchend="onTouchend">
        <i class="weui-loading" v-if="loading"/>
        <slot></slot>
    </button>
</template>
<script>
import getHoverMixin from './mixins/hover';

export default {
    mixins: [getHoverMixin({
        defaultHoverClass: 'button-hover',
        defaultHoverStartTime: 20,
        defaultHoverStayTime: 70
    })],

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
        formType: String
    },

    computed: {
        classNames() {
            let plain = this.plain;
            let disabled = this.disabled;
            let type = this.type;
            let hoverClass = this.getHoverClass() || '';
            return {
                'weui-btn': true,
                [`${hoverClass}`]: this.hover,
                [`weui-btn_plain-${type}`]: plain,
                [`weui-btn_${type}`]: !plain && type,
                'weui-btn_mini': this.size === 'mini',
                'weui-btn_loading': this.loading,
                'weui-btn_disabled': disabled
            };
        }
    },

    methods: {
        onClick(e) {
            this.$emit('click', e);
        }
    }
};
</script>
