<template>
    <view class="hello-wrap">
        <text class="title">Hello Title: {{myName}} - {{myNum}}</text>
        <view :class="myClass">Computed Prop:<text>{{myComputedNum}} - {{obj}}</text></view>
        <slot name="top"></slot>
        <slot></slot>
        <button class="btn" @click="handleClick">click {{source}}-{{num}}</button>
        <button @click="changeObjectData">changeObjectProperty: {{obj.a}}</button>
        <button @click="changeCounter">变更 counter:{{counter}}</button>
        <slot name="bottom"></slot>
        <view class="global-class">这段文本的颜色由组件外的 class 决定</view>
    </view>
</template>
<script>

export default {
    options: {
        addGlobalClass: false
    },
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
            console.log('[hello component] pageLifetimes show', this)
        },

        hide() {
            console.log('[hello component] pageLifetimes hide', this)
        }
    },

    beforeCreate() {
        console.log('[hello component] before create...');
        console.log(this)
    },

    created() {
        console.log('[hello component] created...');
        // console.log(this.properties)
        // console.log(this.$rawProps)
        // console.log(this.$app)
    },

    beforeMount() {
        console.log('[hello component] beforeMount...');
        console.log(this)
        this.myNum = this.num;
    },

    mounted() {
        console.log('[hello component] mounted...', this.obj);
    },

    beforeDestroy() {
        console.log('[hello component] beforeDestroy...');
    },

    destroyed() {
        console.log('[hello component] destroyed...');
    },

    ready() {
        console.log('[hello component] ready...');
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
            this.$emit('counterChange', {
                value: 333
            });
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
