<template>
    <view class="behavior-component-wrap">
         <view class="component-title">Behavior Component Title: {{title}}</view>
         <view>myComputedNum: {{myComputedNum}}</view>
         <slot></slot>
    </view>
</template>
<script>
import behaviorA from '../common/behavior/behaviorA';

export default {
    config: { // The component config defined in component.json
    },

    mixins: [behaviorA],

    components: {
    },

    props: {
        title: String
    },

    data: {
        a: 23,
        b: {
            c: 26,
            d: 56
        }
    },

    computed: {
        myComputedNum() {
            return this.b.c + '-computed';
        }
    },

    beforeCreate() {
        console.log('before create Behavior component...');
        console.log(this)
    },

    created() {
        console.log('create Behavior component...');
    },

    beforeMount() {
        console.log('before mount Behavior component...');
        console.log(this)
    },

    mounted() {
        console.log('mounted Behavior component...', this);
    },

    methods: {
        methodA() {
            console.log('call behvaiorA component methodA...', this);
        }
    }
}
</script>
<style lang="stylus">
.behavior-component-wrap
    background: #fff
    border: 1px solid #ccc
    border-radius: 10px

    .component-title
        font-size: 16px
        padding: 20px
        text-align: center

</style>
