# Vuex 状态管理

`okam` 支持使用 [vuex](https://vuex.vuejs.org/) 作为状态管理库。

!> `okam-core@0.4.10` `okam-build@0.4.13` 开始支持

**注意：** 在页面隐藏时候，`Vuex store` 状态变更监听会自动销毁，基于 `onShow` `onHide` 钩子，对于自定义组件依赖原生自定义组件 `pageLifetimes` 提供的页面生命周期钩子 `hide`、`show`，因此有相应版本要求，具体可以查看[微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)、[百度小程序](http://smartprogram.baidu.com/docs/develop/framework/custom-component_comp/)，对于 `头条` `支付宝` `快应用` 暂未有相应实现。如果想保持一致性，可以自行通过 `$subscribeStoreChange` 和 `$unsubscribeStoreChange` API 进行 `Redux store` 状态变更监听和移除，重复调用不会有副作用。

使用示例，可以参考项目 [okam-examples](https://github.com/awesome-okam/okam-examples)。

## 安装依赖

使用 `vuex` 需要先安装相应的依赖：`npm i vuex --save`。

## 构建配置

`framework` 构建配置项增加 `data` `vuex` 属性值，`vuex` 依赖 `data` 扩展，因此需要一起配置。此外，需要把环境变量做下替换，使用 `replacement` 处理器。

```javascript
{
    framework: ['data', 'vuex'],
    dev: {
        rules: [
            {
                match: '*.js',
                processors: [
                    ['replacement', {'process.env.NODE_ENV': '"development"'}]
                ]
            }
        ]
    },
    prod: {
        rules: [
            {
                match: '*.js',
                processors: [
                    ['replacement', {'process.env.NODE_ENV': '"production"'}]
                ]
            }
        ]
    }
}
```

## 定义 Store

```javascript
// src/store.js
import Vuex from 'vuex';

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    count: 0
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
    increment(state) {
        state.count++;
    },
    decrement(state) {
        state.count--;
    }
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
    increment: ({commit}) => commit('increment'),
    decrement: ({commit}) => commit('decrement'),
    incrementIfOdd({commit, state}) {
        if ((state.count + 1) % 2 === 0) {
            commit('increment');
        }
    },
    incrementAsync({commit}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('increment');
                resolve();
            }, 1000);
        });
    }
};

// getters are functions
const getters = {
    evenOrOdd: state => {
        return state.count % 2 === 0 ? 'even' : 'odd';
    }
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});
```

## 入口脚本注入 Store

```javascript
// src/app.js
import store from './store';

export default {
    config: {},

    // 注入 store，虽然也可以 $store: store，但头条小程序实现上会拷贝 store 值，导致引用丢失，
    // 如果要支持头条小程序，要求传递 function 形式：$store: () => store
    $store: () => store
};
```

## 组件和 Store 数据连接

```
<template>
    <div class="counter-wrap">
        <text class="op-tip">Clicked: {{ count }} times, count is {{ evenOrOdd }}.</text>
        <button class="op-btn" @click="increment">+</button>
        <button class="op-btn" @click="decrement">-</button>
        <button class="op-btn" @click="incrementIfOdd">Increment if odd</button>
        <button class="op-btn" @click="incrementAsync">Increment async</button>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    computed: {
        count() {
            return this.$store.state.count;
        },
        ...mapGetters([
            'evenOrOdd'
        ])
    },

    methods: mapActions([
        'increment',
        'decrement',
        'incrementIfOdd',
        'incrementAsync'
    ])
};
</script>
```

## Store 实例访问

所有组件实例上下文都可以通过 `this.$store` 获取到对应的 store 实例：

```javascript
export default {
    config: {},
    data: {},

    created() {
        let store = this.$store;
        console.log(store.state);
    }
}
```

## API

* `$fireStoreChange()`: 如果你有多个页面引用了同一个 store，但某个页面隐藏情况下，通过另外一个页面更新了 `store`，想在重新显示之前隐藏的页面能够自动同步 `store` 数据变更，可以使用该 API。

    ```javascript
    export default {
        config: {title: 'my page'},
        data: {},
        onShow() {
            this.$fireStoreChange(); // 可以在页面重新显示时候，重新同步该 API
        }
    }
    ```
* `$unsubscribeStoreChange()`: 如果页面隐藏时候，自定义组件的 store 状态变更监听建议也移除掉，考虑到不同平台对于 `pageLifetimes` 支持不同，可以手动调用该 API 进行状态监听移除，该方法重复调用不会有副作用

* `$subscribeStoreChange()`: 用于开发者自行启用 store 状态变更监听，跟 `$unsubscribeStoreChange()` 配套使用

## 使用注意

**不允许外部直接修改 `store` 的 state，只能通过 `actions` `mutations` 修改。**

目前 `Vuex` 支持是通过 模拟 `Vue` 上下文实现的，但实现机制还是有点不同，`store` 每次变更，所有 `computed` 数据会重新计算，而不是只依赖 `store` 状态的 `computed` 属性会重新计算。
