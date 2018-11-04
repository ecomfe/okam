<template>
    <view class="template-ref-syntax-wrap">
        <view>
            <button class="my-btn" ref="myBtn" @click="handleClick">2test button</button>
        </view>
        <view ref="my-view">
            <simple-component ref="myComponent"></simple-component>
        </view>
        <view>
            <button for="item in [1, 2, 3]" ref="forBtn">button-{{item}}</button>
        </view>
        <view>
            <simple-component for="item in [1, 2, 3]" ref="forSimpleComponent">simple-component-{{item}}</simple-component>
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
    },

    methods: {
        handleClick() {
            console.log(this.$refs)
            let result = this.$selector.select('.my-btn');

            console.log(result)
        }
    }
};
</script>

<style lang="stylus">
.vant-weapp-page
    margin: 20px
    padding: 20px
</style>
