<template>
    <span :class="['weui-cells_checkbox', disabled ? 'okam-checkbox-disabled' : '']">
        <input class="weui-check" type="checkbox" @change="onChecked"
            :disabled="disabled" :value="value"
            :name="groupName || name || ''" :checked="checked"/>
        <i class="weui-icon-checked"></i>
    </span>
</template>
<script>
export default {
    props: {
        value: String,
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
            groupName: ''
        };
    },

    methods: {

        /* eslint-disable fecs-camelcase */
        _initCheckboxGroupName(val) {
            this.groupName = val;
            return this.value;
        },

        onChecked(e) {
            this.$emit('change', e);
        }
    }
};
</script>
<style lang="stylus" src="./checkbox.styl">
</style>
