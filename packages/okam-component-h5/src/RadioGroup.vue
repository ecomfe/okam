<template>
    <div><slot></slot></div>
</template>
<script>
import {uuid} from './util';

function getUniqueName() {
    return uuid('radio-group-');
}

function initRadio(vm, radio, index) {
    let init = radio._initRadioGroupName;
    if (typeof init === 'function') {
        let value = init.call(radio, vm.groupName);
        radio.$on('change', e => vm.$emit('change', {detail: {value}}));
    }
}

export default {
    props: {
        name: String
    },

    mounted() {
        this.groupName = this.name || getUniqueName();
        this.$children.forEach(
            (item, index) => initRadio(this, item, index)
        );
    }
};
</script>
