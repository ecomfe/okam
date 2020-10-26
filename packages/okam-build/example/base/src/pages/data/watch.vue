<template>
    <view class="data-watch-wrap">
        <view class="example-item">
            <text>变更计算属性: {{arrLen}}</text>
            <button @click="onAddArrLen">变更数组大小</button>
            <button @click="onChangeArrElemValue">变更数组元素值</button>
            <button @click="onChangeArrElemValue2">变更数组元素值:响应式</button>
        </view>
        <view class="example-item">
            <text>变更 a: {{a}}</text>
            <button @click="onChangeA">变更</button>
        </view>
        <view class="example-item">
            <text>变更 obj: {{obj.num}}</text>
            <button @click="onChangeObjInner">变更对象内部值</button>
            <button @click="onChangeObj">变更对象为新对象</button>
        </view>
        <view class="example-item">
            <text>变更 deep watch obj2: {{obj2.b.c}}</text>
            <button @click="onChangeObj2Inner">变更对象内部值</button>
            <button @click="onChangeObj2">变更对象为新对象</button>
        </view>
        <view class="example-item">
            <text>多watch handler flag: {{flag}}</text>
            <button @click="onChangeFlag">变更 Flag</button>
        </view>
    </view>
</template>

<script>
export default {
    config: {
        title: 'Watch支持'
    },
    data: {
        arr: [{
            a: 3
        }],
        obj: {
            arr: [{
                name: 'abc'
            }],
            num: 89
        },
        a: 33,
        obj2: {
            a: 3,
            b: {
                c: 'str'
            }
        },
        flag: true
    },

    computed: {
        arrLen() {
            return this.arr.length;
        },
        objArrCopy() {
            return this.obj.arr.map(item => item.name);
        },
        aPlus: {
            get: function () {
                return this.a + 1
            },
            set: function (v) {
                this.a = v - 1
            }
        }
    },

    myObj: {
        arr: ['abc']
    },

    watch: {
        arr: 'handleArrChange',

        arrLen(newVal, oldVal) {
            console.log('array len change...', newVal, oldVal, newVal === oldVal);
        },

        objArrCopy: {
            handler(newVal, oldVal) {
                console.log('objArrCopy change...', newVal, oldVal, newVal === oldVal);
            },
            immediate: true
        },

        a: {
            handler(newVal, oldVal) {
                console.log('a change..', newVal, oldVal)
            },
            immediate: true
        },

        obj: {
            handler(newVal, oldVal) {
                console.log('obj change...', newVal, oldVal, newVal === oldVal);
            }
        },

        'obj.arr': {
            handler(newVal, oldVal) {
                console.log('obj.arr change...', newVal, oldVal, newVal === oldVal);
            }
        },

        obj2: {
            handler(newVal, oldVal) {
                console.log('obj2 change...', newVal, oldVal, newVal === oldVal);
            },
            deep: true
        },
        // TODO 由于小程序框架会把数组转成对象。。。待修复
        // flag: [
        //     function (newVal, oldVal) {
        //         console.log('flag change...', newVal, oldVal, newVal === oldVal);
        //     },
        //     function (newVal, oldVal) {
        //         console.log('flag change handler2...', newVal, oldVal, newVal === oldVal);
        //     }
        // ]
    },

    created() {
        this.$watch('arrLen', function (newVal, oldVal) {
            console.log('array len change by api...', newVal, oldVal, newVal === oldVal);
        });

        this.$watch('obj2', function (newVal, oldVal) {
            console.log('obj2 change by api...', newVal, oldVal, newVal === oldVal);
        }, {deep: true, immediate: true});

        this.$watch(function () {
            return this.flag ? this.aPlus + this.obj.num : this.aPlus + this.obj2.a;
        }, function (newVal, oldVal) {
            console.log('custom watch change by api...', newVal, oldVal, newVal === oldVal);
        }, {deep: true, immediate: true});
    },

    methods: {
        handleArrChange(newVal, oldVal) {
            console.log('array change...', newVal, oldVal, newVal === oldVal);
        },

        onAddArrLen() {
            this.arr.push({b: 33});
            console.log(this.arr.length)
        },

        onChangeArrElemValue() {
            this.arr[0].a = 100;
        },

        onChangeArrElemValue2() {
            this.arr[0].a = 400;
        },

        onChangeA() {
            this.aPlus += 10;
        },

        onChangeObjInner() {
            this.obj.num = 102;
        },

        onChangeObj() {
            this.obj = Object.assign({}, this.obj)
        },

        onChangeObj2Inner() {
            this.obj2.b.c = 'newsss';
        },

        onChangeObj2() {
            this.obj2 = Object.assign({}, this.obj2);
        },

        onChangeFlag() {
            this.flag = !this.flag;
        }
    }
}
</script>

<style lang="stylus">
.data-watch-wrap
    position: relative
    padding: 20px
    box-sizing: border-box
    background: #ccc

    button
        margin: 15px 0

    .example-item
        padding: 30px 15px
        margin: 20px 0
        background: #fff

</style>
