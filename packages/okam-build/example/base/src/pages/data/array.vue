<template>
    <view class="data-array-wrap">
        <button @click="changeComponentProp">Change component prop</button>
        <data-component :title="title" :from="from" :obj="obj" :myName="myName" @hello="handleHello"></data-component>
        <view class="click-tip" if="clicked">You click me~</view>
        <view>PageArr: <text for="item in arr">{{item}},</text></view>
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
import DataComponent from '../../components/DataComponent';

export default {
    config: {
        title: 'Page Title'
    },

    components: {
        DataComponent
    },

    data: {
        btnText: 'Hello',
        clicked: false,
        from: 'HomePage',
        myName: 'xx',
        title: 'sss',
        obj: {
            a: 3
        },
        arr: [6, 89]
    },

    methods: {

        changeComponentProp(e) {
            this.from = 'click+' + this.from;
            this.myName = 'jakcc' + this.myName;
            this.title = 'hhh';
            this.obj.a = 666;
            console.log('change...', this.from)
        },

        handleHello(e) {
            this.clicked = true;
            this.btnText = 'You clicked';
            this.$api.showToast({
                title: 'Received Hello',
                duration: 3000
            });
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
            this.arr.splice(1, 1, 56, 33);
            console.log('splice2', this.arr, this.arr.length, this.data.arr, this.data.arr.length);
        }
    }
};
</script>
<style lang="stylus">
.data-array-wrap
    padding: 20px
    box-sizing: border-box
    background: #ddd

    .click-tip
        margin-top: 100px
        padding: 20px
        text-align: center
        color: red
</style>
