<template>
    <span :class="['weui-cells_checkbox', disabled ? 'okam-checkbox-disabled' : '']">
        <input class="weui-check" type="radio" @change="onChecked"
            :disabled="disabled" :value="value"
            :name="groupName || name || ''" :checked="currChecked"/>
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

        initRadioGroupName(val) {
            this.groupName = val;
            return this.value;
        },

        onChecked(e) {
            this.currChecked = true;
            this.$emit('change', e);
        },

        reset() {
            this.currChecked = false;
        }
    }
};
</script>
<style lang="stylus" src="./checkbox.styl"></style>
