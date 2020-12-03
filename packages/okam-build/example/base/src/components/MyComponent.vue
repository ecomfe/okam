<template>
    <view class="my-component-wrap">
        <view class="title">MyComponent-{{myProp}}-{{counter}}</view>
        <hello id="my-hello-wrap" class="my-hello" ref="myHello"
            @counterChange="onCounterChange" :source="myProp"
            :obj="info"
            :num="info.luckyNo" :counter="counter">
            <view>default slot</view>
        </hello>
    </view>
</template>
<script>
import Hello from './Hello';

export default {
    config: { // The component config defined in component.json
    },

    components: {
        Hello
    },

    props: {
        counter: Number,
        myProp: {
            type: String,
            default: 'xx'
        }
    },

    data: {
        info: {
            name: '我的自定义组件',
            luckyNo: 23
        }
    },

    methods: {
        onCounterChange(e) {
            console.log('[mycompoent] catch hello counter change', e);
            // todo: selectComponent
            // console.log(this.selectComponent('#my-hello-wrap'));
        }
    }
}
</script>
<style lang="stylus">
.my-component-wrap
    padding: 20px
    background: #ccc
    .title
        font-size: 16px
        border-bottom: 1px solid #ccc
</style>
