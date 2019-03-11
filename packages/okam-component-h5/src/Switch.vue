<template>
    <input :class="classNames" :style="styleValue" type="checkbox"
        :disabled="disabled" :checked="checked" @change="onChange" />
</template>
<script>
const TYPE_CLASS_MAP = {
    switch: 'switch',
    checkbox: 'check'
};

export default {
    props: {
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
        }
    }
};
</script>
<style lang="stylus">

</style>

