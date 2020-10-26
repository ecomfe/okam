<template>
    <view class="simple-component-wrap">
        <text class="s-title" if="flag">{{text}}</text>
        <simple-component2 ref="a"></simple-component2>
        <button @click="handleClick">get selectQuery</button>
    </view>
</template>
<script>
import SimpleComponent2 from './SimpleComponent2';

export default {
    components: {
        SimpleComponent2
    },

    data: {
        text: 'simple component',
        queryEleHeight: 0
    },

    computed: {
        flag() {
            return true;
        }
    },

    mounted() {
        let query = this.createSelectorQuery();
        query.select('.s-title').boundingClientRect().exec(res => {
                console.log('节点信息：', res[0]);
                this.queryEleHeight = res.length ? res[0].height : '-';
            }
        );
    },

    methods: {
        hello() {
            console.log('hello...')
        },

        handleClick() {
            this.$api.showToast({
                title: 'query:' + this.queryEleHeight
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
