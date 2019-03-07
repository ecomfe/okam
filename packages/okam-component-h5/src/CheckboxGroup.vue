<template>
    <div><slot></slot></div>
</template>
<script>
let counter = 0;
function getUniqueName() {
    return `checkbox-group-${counter++}`;
}

function initCheckbox(vm, checkbox, index) {
    let init = checkbox._initCheckboxGroupName;
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
        });
    }
}

export default {
    props: {
        name: String
    },

    mounted() {
        this._checkState = [];
        this.groupName = this.name || getUniqueName();
        this.$children.forEach(
            (item, index) => initCheckbox(this, item, index)
        );
    }
};
</script>
