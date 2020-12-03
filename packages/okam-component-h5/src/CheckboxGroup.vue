<template>
    <div><slot></slot></div>
</template>
<script>
import {uuid} from './common/util';
import formField from './mixins/formField';

function getUniqueName() {
    return uuid('checkbox-group-');
}

function initCheckbox(vm, checkbox, index) {
    let init = checkbox.initCheckboxGroupName;
    if (typeof init === 'function') {
        const checkState = vm._checkState;

        let value = init.call(checkbox, vm.groupName);
        checkState.push({checked: checkbox.checked, value});

        checkbox.$on('change', e => {
            checkState[index].checked = e.target.checked;

            let checkedValues = [];
            checkState.forEach(
                item => item.checked && checkedValues.push(item.value)
            );
            vm.$emit('change', {detail: {value: checkedValues}});
            vm.$emit('_change', checkedValues);
        });
    }
}

export default {
    mixins: [formField],
    model: {
        prop: 'value',
        event: '_change'
    },
    props: {
        name: String
    },

    mounted() {
        this._checkState = [];
        this.groupName = this.name || getUniqueName();
        this.$children.forEach(
            (item, index) => initCheckbox(this, item, index)
        );
    },

    methods: {
        getFieldValue() {
            return this._checkState
                .filter(item => item.checked)
                .map(item => item.value);
        },

        resetFieldValue() {
            this.$children.forEach(item => item.reset());
            this._checkState.forEach(item => (item.checked = false));
        }
    }
};
</script>
