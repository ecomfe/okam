<template>
    <div><slot></slot></div>
</template>
<script>
import {uuid} from './util';
import formField from './mixins/formField';

function getUniqueName() {
    return uuid('radio-group-');
}

function initRadio(vm, radio, index) {
    let init = radio.initRadioGroupName;
    if (typeof init === 'function') {
        let value = init.call(radio, vm.groupName);
        radio.$on('change', e => {
            vm.$emit('change', {detail: {value}});
            vm.value = value;
        });
    }
}

export default {
    mixins: [formField],

    props: {
        name: String
    },

    mounted() {
        this.groupName = this.name || getUniqueName();
        let value = '';
        this.$children.forEach(
            (item, index) => {
                item.checked && (value = item.value);
                initRadio(this, item, index);
            }
        );
        this.value = value;
    },

    methods: {
        getFieldValue() {
            return this.value;
        },

        resetFieldValue() {
            this.$children.forEach(
                item => item.reset()
            );
            this.value = '';
        }
    }
};
</script>
