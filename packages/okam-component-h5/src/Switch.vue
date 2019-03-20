<template>
    <input :class="classNames" :style="styleValue" type="checkbox"
        :disabled="disabled" :checked="currChecked" @change="onChange" />
</template>
<script>
import formField from './mixins/formField';

export default {
    mixins: [formField],

    props: {
        name: String,
        checked: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        type: { // checkbox currently is not supported
            type: String,
            default: 'switch'
        },
        color: String
    },

    data() {
        return {currChecked: false};
    },

    watch: {
        checked: {
            handler(val) {
                this.currChecked = val;
            },
            immediate: true
        }
    },

    computed: {
        classNames() {
            let value = [];
            let typeClass = this.type === 'switch' ? 'weui-switch' : '';
            typeClass && value.push(typeClass);
            return value;
        },

        styleValue() {
            let color = this.color;
            let style = color ? {backgroundColor: color} : {};
            if (this.currChecked && color) {
                style.borderColor = color;
            }
            return style;
        }
    },

    methods: {
        onChange(e) {
            this.currChecked = e.target.checked;
            this.$emit('change', {
                detail: {
                    value: this.currChecked
                }
            });
        },

        getFieldValue() {
            return this.currChecked;
        },

        resetFieldValue() {
            this.currChecked = false;
        }
    }
};
</script>
