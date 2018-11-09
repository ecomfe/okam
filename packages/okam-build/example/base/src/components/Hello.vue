<template>
    <view class="hello-wrap">
        <text class="title">Hello Title: {{myName}} - {{myNum}}</text>
        <view :class=' myClass '>Computed Prop:<text>{{myComputedNum}} - {{obj.toString()}}</text></view>
        <slot name="top"></slot>
        <slot></slot>
        <button class="btn" @click="handleClick">{{source}}-{{num}}</button>
        <button @click="changeObjectData">changeObjectProperty: {{obj.a}}</button>
        <button @click="changeCounter">变更 counter:{{counter}}</button>
        <slot name="bottom"></slot>
    </view>
</template>
<script>

export default {

    // mixins: ['form-fields'],

    config: { // The component config defined in component.json
    },

    components: {
    },

    props: {
        obj: Object,

        myName: String,

        counter: Number,

        source: {
            type: String,
            default: 'Baidu'
        },

        num: {
            type: Number
            // observer(...args) {
            //     console.log('num change...', this.num)
            //     console.log(args)
            //     console.log(this)
            // }
        }
    },

    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },

    data: {
        title3: 'xxx',
        myNum: 0,
        myClass: 'test-class'
    },

    computed: {
        myComputedNum() {
            return this.num + '-computed';
        }
    },

    pageLifetimes: {
        show() {
            console.log('hello component show', this)
        },

        hide() {
            console.log('hello component hide', this)
        }
    },

    beforeCreate() {
        console.log('before create hello component...');
        console.log(this)
    },

    created() {
        console.log('create hello component...');
        // console.log(this.properties)
        // console.log(this.$rawProps)
        // console.log(this.$app)
    },

    beforeMount() {
        console.log('before mount hello component...');
        console.log(this)
        this.myNum = this.num;
    },

    mounted() {
        console.log('mounted hello component...', this.obj);
    },

    beforeDestroy() {
        console.log('before destroy hello component...');
    },

    destroyed() {
        console.log('destroyed hello component...');
    },

    methods: {
        handleClick(...args) {
            console.log("click in Hello", args);
            this.sayHi();
            this.$emit('hi', {name: 'Jack'});
        },

        sayHi() {
            console.log('hi in', this.title);
        },

        changeObjectData() {
            this.obj.a = 898;
        },

        changeCounter() {
            console.log('child trigger change counter...')
            this.$emit('counterChange', 333);
        }
    }
}
</script>
<style lang="stylus">
.title
    color:#3c76ff

.hello-wrap
    padding: 10px
    background: #fff

    .title
        font-size: 16px
    .btn
        width: 150px
</style>
