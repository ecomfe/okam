<template>
    <i :class="className" :style="styleValue" @click="onClick"></i>
</template>
<script>
export default {
    props: {
        type: String,
        size: {
            type: [String, Number],
            default: '23px'
        },
        color: String
    },

    computed: {
        styleValue() {
            let size = this.size;
            if (typeof size === 'number' || /^\d+$/.test(size)) {
                size += 'px';
            }

            let val = {fontSize: size};
            let color = this.color;
            color && (val.color = color);
            return val;
        },

        className() {
            let type = this.type;
            if (type === 'success_no_circle') {
                type = type.replace(/_/g, '-');
            }

            return `weui-icon-${type}`;
        }
    },

    methods: {
        onClick(e) {
            this.$emit('click', e);
        }
    }
};
</script>
