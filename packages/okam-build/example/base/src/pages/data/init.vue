<template>
    <view class="data-init-wrap">
        <view>total: {{total}}</view>
        <view>num: {{num}}</view>
        <button @click="addNum">变更 num</button>
    </view>
</template>

<script>
export default {
    config: {
        title: '页面数据初始化'
    },
    data() {
        return {
            num: 33,
            arr: [23, 12, 333]
        }
    },
    computed: {
        total() {
            return this.arr.length;
        }
    },
    methods: {
        addNum() {
            this.num++;
            this.arr.push(this.num);
        }
    }
};
</script>

<style lang="stylus">
.data-init-wrap
    position: relative
    height: 100%
    padding: 20px
    background: #ccc

</style>
