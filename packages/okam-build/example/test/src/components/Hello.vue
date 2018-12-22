<template>
    <view class="hello-wrap">
        <button plain class="hello-btn" @click="handleClick">Hello in {{from}}</button>
    </view>
</template>
<script>
export default {
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
.hello-wrap {
    margin: 20px;
}

.hello-wrap .hello-btn {
    border: none;
    text-align: center;
    background: #fff;
}
</style>
