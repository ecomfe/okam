<template>
    <view class="comp-page">
        <button @click="goToOtherPage">GoToOtherPage</button>
        <text class="title">Component Page Title: 父组件 counter = {{counter}}</text>
        <hello ref="myHello" :class="myClass" :obj="{...obj}"
               myName="ddd" :num="num" :counter="counter"
               @hi="handleHi" @counterChange="onCounterChange">
            <view slot="top">Hello Top</view>
            <view class="hello-title">{{myTitle}}</view>
            <view slot="bottom">Hello bottom</view>
        </hello>
        <button @click="addNum">add num</button>
        <button @click="changeObjectData">change父组件的objectData: {{obj.a}}</button>
        <button @click="getObjectData">getObjectData</button>
        <button @click="updateCounter">变更父组件counter:{{counter}}</button>
        <my-component :counter="counter"></my-component>
    </view>
</template>

<script>
import Hello from '../../components/Hello';
import MyComponent from '../../components/MyComponent';

export default {
    config: {
        navigationBarTitleText: '自定义组件示例'
    },

    components: {
        Hello,
        MyComponent
    },

    data: {
        myClass: 'hello-info',
        myTitle: '自定义组件默认Slot',
        num: 33,
        counter: 0,
        obj: {a: 3}
    },

    mounted() {
        console.log('mounted...', this.num);
        console.log(this.$refs);
        this.num += 1;

        setTimeout(() => {
            this.counter += 666;
        }, 3000);
    },

    methods: {
        addNum() {
            console.log('add num...');
            this.num += 1;
        },

        handleHi(...args) {
            console.log('hi trigger...', args);
        },

        getObjectData() {
            console.log(this.obj);
        },

        changeObjectData() {
            this.obj.a = 666;
        },

        onCounterChange(e) {
            console.log('parent receive child counter change', e);
            this.counter = e.detail.value;
        },

        updateCounter() {
            this.counter = 892323;
        },

        goToOtherPage() {
            this.$api.navigateTo({
                url: '/pages/todos/counter'
            });
        }
    }
};
</script>

<style lang="stylus">
.title
    display: block
    width: 100%
    color: #008000
    font-size: 20px
    text-align: center

.comp-page
    margin: 10px
    .hello-info
        display: block
        border: 1px solid #ddd
    .hello-title
        font-weight: 600
        font-size: 16
</style>
