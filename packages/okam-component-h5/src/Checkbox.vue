<template>
    <span :class="['weui-cells_checkbox', disabled ? 'okam-checkbox-disabled' : '']">
        <input class="weui-check" type="checkbox" @change="onChange"
            :disabled="disabled" :value="value"
            :name="groupName || name || ''" :checked="currChecked"/>
        <i class="weui-icon-checked"></i>
    </span>
</template>
<script>
export default {
    props: {
        value: [String, Number],
        disabled: {
            type: Boolean,
            default: false
        },
        checked: {
            type: Boolean,
            default: false
        },
        name: String
        // color props is not supported currently
    },

    data() {
        return {
            groupName: '',
            currChecked: false
        };
    },

    watch: {
        checked: {
            handler(val) {
                this.currChecked = val;
            },
            immediate: true
        }
    },

    methods: {

        initCheckboxGroupName(val) {
            this.groupName = val;
            return this.value;
        },

        reset() {
            this.currChecked = false;
        },

        onChange(e) {
            this.currChecked = e.target.checked;
            this.$emit('change', e);
        }
    }
};
</script>
<style lang="stylus" src="./checkbox.styl">
</style>
