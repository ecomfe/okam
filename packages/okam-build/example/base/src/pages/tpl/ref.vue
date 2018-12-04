<template>
    <view class="template-ref-syntax-wrap">
        <view>
            <button class="my-btn" @click="updateArray">change ref components</button>
            <button class="my-btn" ref="myBtn" @click="handleClick">test button</button>
        </view>
        <view ref="my-view">
            <simple-component ref="myComponent"></simple-component>
        </view>
        <view>
            <button for="item in arr" ref="forBtn">button-{{item}}</button>
        </view>
        <view>
            <simple-component for="item in arr" ref="forSimpleComponent">simple-component-{{item}}</simple-component>
        </view>
    </view>
</template>

<script>
import SimpleComponent from '../../components/SimpleComponent';

export default {
    config: {
        title: '模板 Ref 属性支持'
    },

    components: {
        SimpleComponent
    },

    data: {
        arr: [1, 2]
    },

    methods: {
        updateArray() {
            this.arr = [1, 4, 5];
        },

        handleClick() {
            console.log(this.$refs)
            let result = this.$selector.select('.my-btn');

            console.log(result)
            console.log(this)
        }
    }
};
</script>

<style lang="stylus">
.vant-weapp-page
    margin: 20px
    padding: 20px
</style>
