<template>
    <input class="weui-input" :value="value == null ? '' : value"
        :disabled="disabled" :type="inputType" :autofocus="focus"
        :maxlength="allowInputMaxLen" :placeholder="placeholder || ''"
        :name="name || ''" v-bind="$attrs"
        @input="onInput" @focus="onFocus" @blur="onBlur" @change="onChange" @keydown.enter="onEnter" />
</template>
<script>
import formField from './mixins/formField';

export default {
    mixins: [formField],

    props: {
        name: String,
        value: String,
        type: {
            type: String,
            default: 'text'
        },
        password: {
            type: Boolean,
            default: false
        },
        placeholder: String,
        disabled: {
            type: Boolean,
            default: false
        },
        maxlength: {
            type: [Number, String],
            default: 140
        },
        focus: {
            type: Boolean,
            default: false
        }
        // not supported props:
        // cursor cursor-spacing
        // adjust-position
        // selection-start selection-end
        // confirm-hold confirm-type
        // placeholder-class placeholder-style
    },

    computed: {
        inputType() {
            if (this.password) {
                return 'password';
            }

            let type = this.type;
            if (type === 'digit') {
                return 'number';
            }

            if (type === 'idcard') {
                return 'text';
            }

            return type;
        },
        allowInputMaxLen() {
            let maxLen = parseInt(this.maxlength, 10) || 0;
            return maxLen > 0 ? maxLen : '';
        }
    },

    mounted() {
        this.focusInput();
    },

    watch: {
        focus: 'focusInput'
    },

    methods: {
        focusInput() {
            let el = this.$el;
            if (this.focus) {
                el.focus();
            }
        },

        onInput(e) {
            let value = e.target.value;
            if (this.inputType === 'number' && value) {
                let maxLen = this.allowInputMaxLen;
                maxLen && (value = value.substring(0, maxLen));
                e.target.value = value;
            }

            Object.defineProperty(e, 'detail', {
                enumerable: true,
                value: {value}
            });

            this.$emit('input', e);
        },

        onChange(e) {
            this.$emit('change', e);
        },

        onFocus(e) {
            this.$emit('focus', {
                detail: {
                    value: e.target.value
                }
            });
        },

        onBlur(e) {
            this.$emit('blur', {
                detail: {
                    value: e.target.value
                }
            });
        },

        onEnter(e) {
            this.$emit('confirm', {
                detail: {
                    value: e.target.value
                }
            });
        },

        getFieldValue() {
            return this.$el.value;
        },

        resetFieldValue() {
            this.$el.value = '';
        }
    }
};
</script>
<style>
.weui-input {
    box-sizing: border-box;
}
</style>
