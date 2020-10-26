<template>
    <view class="slot-wrap">
        <slot name="inner" var-name="name"></slot>
    </view>
</template>
<script>
export default {
    data: {
        name: 'swan-inner'
    },
    config: {
    },

    props: {
        from: String
    },

    components: {
    },

    data: {
    },

    methods: {
        handleClick() {
            this.$emit('hello', {from: this.from});
        }
    }
};
</script>
<style>
.slot-wrap {
    margin: 20px;
}
</style>
