<template>
    <view class="simple-component-wrap">
        <text class="f-title" if="flag">{{text}}</text>
        <simple-component2 ref="a"></simple-component2>
        <button @click="handleClick">simple click</button>
    </view>
</template>
<script>
import SimpleComponent2 from './SimpleComponent2';

export default {
    components: {
        SimpleComponent2
    },

    data: {
        text: 'simple component'
    },

    computed: {
        flag() {
            return true;
        }
    },

    mounted() {
        console.log('simple component mounted', this);
        let query = this.createSelectorQuery();
        query.selectAll('.f-title').boundingClientRect().exec(
            (res) => {
                this.queryEle = res.length ? res[0].height : '-';
                console.log('query res2222', res);
            }
        );
    },

    methods: {
        hello() {
            console.log('hello...')
        },

        handleClick() {
            this.$api.showToast({
                title: 'query:' + this.queryEle
            });
        }
    }
}
</script>
<style lang="stylus">
.simple-component-wrap
    padding: 20px
    margin: 20px
    border: 1px solid #ccc
    background: #fff
</style>
