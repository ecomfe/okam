<template>
    <view>
        <view class="greeting">Hello {{title}} 点击次数 {{count}}</view>
        <button @click="decrement">-点击次数</button>
        <button @click="increment">+点击次数</button>
    </view>
</template>

<script lang="ts">

import Employee from '../../common/ts/Employee';

export default {
    config: { // The page config defined in page.json
        navigationBarTitleText: 'TypeScript 语法支持',
        backgroundColor: '#fff'
    },
    data: {
        title: 'Typescript 测试',
        count: 0
    },
    beforeCreate() {
        console.log('before create page...');
    },

    created() {
        let count: number = 0;
        let worker = new Employee({firstName: 'Jack', lastName: 'Lee', age: 23});
        let worker2 = new Employee({firstName: 'Kate', lastName: 'Chen', age: 25});
        worker.greet(worker2);
        worker.work(5);

        console.log('create page...');
    },

    methods: {
        increment() {
            this.count++;
            console.log('增加后count值', this.count);
        },
        decrement() {
            if (this.count > 0) {
                this.count--;
                console.log('减少后count值', this.count);
            }
        },
    }
};
</script>

<style lang="less">
@import './dep.less';
@import '../../common/css/font.less';

.greeting {
    font-size: 20px;
    color: chocolate;
}
</style>
