<template>
    <view class="template-ref-syntax-wrap">
        <text class="f-title" if="flag">hello</text>
        <view for="tabs" :key="index">arritem: {{item.name}}</view>
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
        arr: [1, 2],
        tabs: [{name: 'a1'}]
    },

    computed: {
        flag() {
            return true;
        }
    },

    mounted() {
        let query = this.$api.createSelectorQuery().in(this);
        query.selectAll('.f-title').boundingClientRect().exec(
            (res) => {
                console.log('query res', res);
            }
        );

        this.tabs.push({name: 'a2'});
    },

    methods: {
        updateArray() {
            this.arr = [1, 4, 5];
        },

        handleClick() {
            console.log(this.$refs)
        }
    }
};
</script>

<style lang="stylus">
.template-ref-syntax-wrap
    margin: 20px
    padding: 20px
</style>
