<template>
    <button
        class="okam-button"
        :class="classNames"
        :disabled="disabled"
        :type="formType"
        @click="onClick"
        @touchstart="onTouchstart"
        @touchend="onTouchend"
    >
        <i v-if="loading" class="weui-loading"/>
        <slot/>
    </button>
</template>
<script>
import getHoverMixin from './mixins/hover';

export default {
    mixins: [
        getHoverMixin({
            defaultHoverClass: 'button-hover',
            defaultHoverStartTime: 20,
            defaultHoverStayTime: 70
        })
    ],

    props: {
        /**
         * size 大小
         */
        size: {
            type: String,
            default: 'default'
        },
        /**
         * type 类型
         */
        type: {
            type: String,
            default: 'default'
        },
        /**
         * plain 按钮是否镂空，背景色透明
         */
        plain: {
            type: Boolean,
            default: false
        },
        /**
         * disabled 是否禁用
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * loading 名称前是否带有 loading 图标
         */
        loading: {
            type: Boolean,
            default: false
        },
        /**
         * formType 用于<form/>组件，点击分别会触发<form/>组件的 submit/reset 事件
         */
        formType: {
            type: String,
            default: 'buttonclick'
        },
        // List to be supported
        // https://smartprogram.baidu.com/docs/develop/component/formlist_button/
        // open-type
        // hover-class
        // hover-stop-propagation
        // hover-start-time
        // hover-stay-time
        // bindgetphonenumber
        // bindgetuserinfo
        // bindopensetting
        // bindcontact
        // bindchooseaddress
        // bindchooseinvoicetitle
        // contact
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

<style lang="stylus">
.okam-button
    &.weui-btn_primary
        background-color #38f
    &.weui-btn_disabled.weui-btn_primary
        background-color #3c76ff
        opacity .3
    &.weui-btn_primary:not(.weui-btn_disabled):active
        color hsla(0,0%,100%,.6)
        background-color #3c76ff
    &.weui-btn_default
        background-color #fff
</style>