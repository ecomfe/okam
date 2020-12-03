<template>
    <form @submit="onSubmit" @reset="onReset"><slot></slot></form>
</template>
<script>

function initFormField(fields, vm) {
    let children = vm.$children;
    children.forEach(item => {
        if (item.$isFormField) {
            fields[item.name || ''] = item.getFieldValue();
        }
        else {
            initFormField(fields, item);
        }
    });
}

function resetFormField(vm) {
    let children = vm.$children;
    children.forEach(item => {
        if (item.$isFormField) {
            item.resetFieldValue();
        }
        else {
            resetFormField(item);
        }
    });
}

export default {
    methods: {
        onSubmit(e) {
            e.preventDefault();
            let formData = {};
            initFormField(formData, this);
            this.$emit('submit', {detail: {value: formData}});
        },

        onReset(e) {
            e.preventDefault();
            resetFormField(this);
            this.$emit('reset', e);
        }
    }
};
</script>
