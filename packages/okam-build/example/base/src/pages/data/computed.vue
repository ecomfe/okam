<template>
    <view class="data-computed-wrap">
        <view class="example-item">
            <text>{{myNum1}} - {{myNum2}}</text>
            <button @click="changeNum">变更 Num</button>
        </view>
        <view class="example-item">
            <text>计算属性: {{name}}</text>
        </view>
        <view class="example-item">
            <text>使用箭头函数计算属性: {{arrowName}}</text>
        </view>
        <view class="example-item">
            <text>数组长度: {{arrLen}}</text>
            <button @click="addArrLen">增加长度</button>
        </view>
        <view class="example-item">
            <text>子数组: {{objArrCopy}}</text>
            <button @click="upObjArr">更新数组</button>
        </view>
        <view class="example-item">
            <text>动态依赖: {{dynamicDepValue}}</text>
            <button @click="upDynamicValueDep">变更依赖</button>
        </view>
        <view class="example-item">
            <text>计算属性调用 method: {{callMethodValue}}</text>
            <button @click="upMethodInitValue">变更初始值</button>
        </view>
        <view class="example-item">
            <text>setter/getter: {{a}} - {{aPlus}}</text>
            <button @click="setComputedValue">变更Computed属性值</button>
        </view>
    </view>
</template>

<script>
export default {
    config: {
        title: '计算属性'
    },
    data: {
        firstName: 'Jack',
        lastName: 'Lee',
        arr: [],
        obj: {
            arr: [{
                name: 'abc'
            }],
            num: 89
        },
        num: 33,
        flag: false,
        methodInitValue: 11,
        a: 1
    },
    computed: {
        name() {
            return this.firstName + ' ' + this.lastName;
        },
        arrowName: vm => (vm.firstName + ' ' + vm.lastName),
        arrLen() {
            return this.arr.length;
        },
        objArrCopy() {
            return this.obj.arr.map(item => item.name);
        },
        dynamicDepValue() {
            if (this.flag) {
                return 'num:' + this.num;
            }
            return 'obj.num:' + this.obj.num;
        },
        callMethodValue() {
            return this.addMethodValue(this.methodInitValue);
        },
        // 读取和设置
        aPlus: {
            get: function () {
                return this.a + 1
            },
            set: function (v) {
                this.a = v - 1
            }
        },

        myNum2() {
            return this.myNum1 + 10;
        },

        myNum1() {
            return this.num + 10;
        }
    },
    methods: {
        changeNum() {
            this.num = 0;
        },

        setComputedValue() {
            this.aPlus = 100;
        },

        addMethodValue(value) {
            return value + 10;
        },

        upMethodInitValue() {
            this.methodInitValue++;
        },

        addArrLen() {
            this.arr.push(1);
            console.log(this.arr.length)
        },

        upObjArr() {
            let arr = this.obj.arr;
            arr.unshift({name: arr.length + '-abc'});
        },

        upDynamicValueDep() {
            this.flag = !this.flag;
            if (this.flag) {
                this.num++;
            }
            else {
                this.obj.num++;
            }
        }
    }
};
</script>

<style lang="stylus">
.data-computed-wrap
    position: relative
    padding: 20px
    box-sizing: border-box
    background: #ccc

    .example-item
        padding: 30px 15px
        margin: 20px 0
        background: #fff

</style>
