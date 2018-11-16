# 状态管理

`okam` 支持使用 [redux](https://github.com/reduxjs/redux) 作为状态管理库，由于 [vuex](https://github.com/vuejs/vuex) 跟 [vue](https://github.com/vuejs/vue) 是耦合的，暂时不支持在 `okam` 框架下使用。

**注意：** 目前实现，在页面隐藏时候，组件的状态变更监听自动销毁，依赖原生自定义组件 `pageLifetimes` 提供的页面生命周期钩子 `hide`、`show`，因此有相应版本要求，具体可以查看[微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)、[百度小程序](http://smartprogram.baidu.com/docs/develop/framework/custom-component_comp/)，对于支付宝暂未有相应实现。

## 安装依赖

使用 `redux` 需要先安装相应的依赖：`npm i redux --save`，如果需要使用异步 Action ，还需要安装相应的中间件依赖，比如 [redux-thunk](https://github.com/reduxjs/redux-thunk) 或者其它自己熟悉的中间件。

## 构建配置

`framework` 构建配置项增加 `data` `redux` 属性值，`redux` 依赖 `data` 扩展，因此需要一起配置。此外，需要把环境变量做下替换，使用 `replacement` 处理器。

```javascript
{
    framework: ['data', 'redux'],
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

## 定义 Action

```javascript
// src/store/action.js
export increment(value) {
    return {
        type: 'INCREMENT',
        value
    };
}

export decrement(value) {
    return {
        type: 'DECREMENT',
        value
    };
}
```

## 定义 Reducer

```javascript
// src/store/reducer.js
function increment(state, {value}) {
    state.count += value;
    return state;
}

function decrement(state, {value}) {
    state.count -= value;
    return state;
}

export default (state = {count: 0}, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return increment(state, action);
        case 'DECREMENT':
            return decrement(state, action);
        default:
            return state;
    }
};
```

## 定义 Store

```javascript
// src/store/index.js
import {createStore} from 'redux';
import rootReducer from './reducer';

export default createStore(rootReducer);
```

## 入口脚本注入 Store

```javascript
// src/app.js
import store from './store';

export default {
    config: {},

    // 注入 store
    $store: store
};
```

## 组件和 Store 数据连接

```javascript
// src/pages/index.okm#script
import * as actions from '../store/action';

export default {
    data: {
        num: 3,
        initCounter: 0
    },

    computed: {
        local() {
            return this.num;
        }
    },

    $store: { // 通过 `$store` 定义 store 跟组件数据关联

        // 定义 store computed 属性
        computed: ['count'], // this.count 等价于 store.getState().count
        computed: {
            myCount: 'count', // 定义 store 状态的别名，this.myCount 等价于 store.getState().count

            otherState(state) {
                return state.count + this.local + this.initCounter;
            }
        },

        // 定义 store mutation actions
        actions: actions, // this.increment(2), this.decrement(10);
        actions: [
            actions, // original actions
            {
                incr: 'increment', // this.incr(10) 等价于 store.dispatch(actions.increment(10))
                decr: 'decrement',
                op(type, value) { // this.op('INCREMENT', 3);
                    // 不能访问组件实例
                    return {type, value};
                }
            }
        ]
    }
};
```

## Store 实例访问

所有组件实例上下文都可以通过 `this.$store` 获取到对应的 store 实例：

```javascript
export default {
    config: {},
    data: {},

    created() {
        let store = this.$store;
        console.log(store.getState());
    }
}
```

## 使用注意

由于 `store` 跟 `组件` 数据连接是基于 `computed` 实现的，因此定义的 `computed` 属性不能跟现有冲突，其次通过定义 `actions` 来定义组件修改 `store` 的 action，同样定义的 action 方法不能跟组件实例定义的 method 冲突。

**不允许外部直接修改 `store` 的 state，只能通过触发的 `action` 修改。**

目前实现机制，会导致每次 store 变更，computed 数据会重新计算，对于列表型数据，每次变更都会导致整个列表数据重新 `setData`，因此如果列表数据量比较大，可能会有性能问题。
