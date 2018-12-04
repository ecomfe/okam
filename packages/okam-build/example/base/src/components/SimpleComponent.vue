<template>
    <view class="simple-component-wrap">
        <text>{{text}}</text>
        <simple-component2 ref="a"></simple-component2>
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

    mounted() {
        console.log('simple component mounted', this);
    },

    methods: {
        hello() {
            console.log('hello...')
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
