<template>
    <div @click="onClick"><slot></slot></div>
</template>
<script>
import animation from './mixins/animation';
import getHoverMixin from './mixins/hover';

export default {
    mixins: [getHoverMixin({
        defaultHoverStartTime: 50,
        defaultHoverStayTime: 400
    }), animation],

    methods: {
        onClick(e) {
            this.$emit('click', e);
        }
    }
}
</script>

