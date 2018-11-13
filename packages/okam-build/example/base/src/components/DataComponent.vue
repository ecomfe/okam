<template>
    <view class="data-component-wrap">
        <button plain class="hello-btn" @click="handleClick">Hello in {{from}}</button>
        <view>{{myName}}</view>
        <view>title: {{title}}</view>
        <view>A: {{obj.a}}</view>
        <view>Arr: <text for="item in arr">{{item}},</text></view>
        <view><button @click="onPush">Push</button></view>
        <view><button @click="onPush2">Push2</button></view>
        <view><button @click="onPop">Pop</button></view>
        <view><button @click="onShift">Shift</button></view>
        <view><button @click="onUnshift">Unshift</button></view>
        <view><button @click="onUnshift2">Unshift2</button></view>
        <view><button @click="onSplice">Splice</button></view>
        <view><button @click="onSplice2">Splice2</button></view>
    </view>
</template>
<script>
export default {
    config: {
    },

    props: {
        from: String,
        myName: String,
        title: String,
        obj: Object
    },

    components: {
    },

    data: {
        arr: [23, 12]
    },

    watch: {
        obj() {
            console.log('obj change', arguments);
        }
    },

    created() {
        this.$watch('title', function (newVal, oldVal) {
          console.log('watch', newVal, oldVal, 'donw');
        });
    },

    mounted() {
        console.log('mounted,', this);
    },

    methods: {
        handleClick() {
            this.$emit('hello', {from: this.from});
        },

        onPush() {
            this.arr.push(23);
            console.log('push', this.arr, this.arr.length, this.data.arr, this.data.arr.length);
        },

        onPush2() {
            this.arr.push(56, 89);
            console.log('push2', this.arr, this.arr.length, this.data.arr, this.data.arr.length);
        },

        onPop() {
            this.arr.pop();
            console.log('pop', this.arr, this.arr.length, this.data.arr, this.data.arr.length);
        },

        onShift() {
            this.arr.shift();
            console.log('shift', this.arr, this.arr.length, this.data.arr, this.data.arr.length);
        },

        onUnshift() {
            this.arr.unshift(5);
            console.log('unshift', this.arr, this.arr.length, this.data.arr, this.data.arr.length);
        },

        onUnshift2() {
            this.arr.unshift(2, 4);
            console.log('unshift2', this.arr, this.arr.length, this.data.arr, this.data.arr.length);
        },

        onSplice() {
            this.arr.splice(2, 1);
            console.log('splice', this.arr, this.arr.length, this.data.arr, this.data.arr.length);
        },

        onSplice2() {
            this.arr.splice(1, 1, 33, 56);
            console.log('splice2', this.arr, this.arr.length, this.data.arr, this.data.arr.length);
        }
    }
};
</script>
<style lang="stylus">
.data-component-wrap
    padding: 20px
    margin: 20px 0

    .hello-btn
        margin: 0 auto
        background: #fff
        text-align: center
        border-radius: 120px
        border: none
</style>
