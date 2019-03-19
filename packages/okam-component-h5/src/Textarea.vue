<template>
    <textarea class="weui-textarea" v-model="currValue"
        :disabled="disabled" :autofocus="focus" :maxlength="allowInputMaxLen"
        :placeholder="placeholder || ''" v-bind="$attrs"
        @input="onInput" @focus="onFocus" @blur="onBlur" @change="onChange" />
</template>
<script>
import formField from './mixins/formField';

export default {
    mixins: [formField],

    props: {
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
        autoFocus: {
            type: Boolean,
            default: false
        },
        focus: {
            type: Boolean,
            default: false
        },
        autoHeight: {
            type: Boolean,
            default: false
        }
        // not supported props:
        // cursor cursor-spacing
        // adjust-position
        // selection-start selection-end
        // placeholder-class placeholder-style
        // fixed show-confirm-bar
    },

    data() {
        return {
            currValue: ''
        };
    },

    computed: {
        allowInputMaxLen() {
            let maxLen = parseInt(this.maxlength, 10) || 0;
            return maxLen > 0 ? maxLen : '';
        }
    },

    watch: {
        focus: 'focusInput',
        value: {
            handler(val) {
                this.currValue = val == null ? '' : val;
            },
            immediate: true
        }
    },

    mounted() {
        if (this.autoHeight) {
            let el = this.$el;

            // init line height
            let lineHeight = parseFloat(
                window.getComputedStyle(el).getPropertyValue('line-height')
            ) || 16;
            this.lineHeight = lineHeight;

            // recomputed rows
            el.style.height = 'auto';
            el.rows = 1;
            this.baseRows = this.updateAutoHeightRows(true);
        }
    },

    methods: {
        updateAutoHeightRows(init) {
            let el = this.$el;
            let oldRows = el.rows;

            el.rows = this.baseRows || 1;
            let rowsNum = Math.floor(el.scrollHeight / this.lineHeight);
            el.rows = rowsNum;

            if (!init && oldRows !== rowsNum) {
                this.$emit('linechange', {
                    detail: {
                        lineCount: rowsNum
                    }
                });
            }

            return rowsNum;
        },

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

            this.autoHeight && this.updateAutoHeightRows();

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

        getFieldValue() {
            return this.$el.value;
        },

        resetFieldValue() {
            this.$el.value = '';
        }
    }
};
</script>
