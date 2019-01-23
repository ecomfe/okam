# Redux 状态管理

`okam` 支持使用 [redux](https://github.com/reduxjs/redux) 作为状态管理库~~，由于 [vuex](https://github.com/vuejs/vuex) 跟 [vue](https://github.com/vuejs/vue) 是耦合的，暂时不支持在 `okam` 框架下使用~~。

!> `快应用` `okam-core@0.4.8` 开始支持

**注意：** 在页面隐藏时候，`Redux store` 状态变更监听会自动销毁，基于 `onShow` `onHide` 钩子，对于自定义组件依赖原生自定义组件 `pageLifetimes` 提供的页面生命周期钩子 `hide`、`show`，因此有相应版本要求，具体可以查看[微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)、[百度小程序](http://smartprogram.baidu.com/docs/develop/framework/custom-component_comp/)，对于 `头条` `支付宝` `快应用` 暂未有相应实现。如果想保持一致性，可以自行通过 `$subscribeStoreChange` 和 `$unsubscribeStoreChange` API 进行 `Redux store` 状态变更监听和移除，重复调用不会有副作用。

使用示例，可以参考项目 [TodoList](https://github.com/awesome-okam/okam-todo)。

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

    // okam-core@0.4.9 开始
    // 注入 store，虽然也可以 $store: store，但头条小程序实现上会拷贝 store 值，导致引用丢失，
    // 为了跟 Vuex 使用一致，建议统一传递 function 形式：$store: () => store
    $store: () => store,

    // okam-core@0.4.9 之前
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
* `$unsubscribeStoreChange()`: `okam-core@0.4.10` 如果页面隐藏时候，自定义组件的 store 状态变更监听建议也移除掉，考虑到不同平台对于 `pageLifetimes` 支持不同，可以手动调用该 API 进行状态监听移除，该方法重复调用不会有副作用

* `$subscribeStoreChange()`:  `okam-core@0.4.10` 用于开发者自行启用 store 状态变更监听，跟 `$unsubscribeStoreChange()` 配套使用

## 使用注意

由于 `store` 跟 `组件` 数据连接是基于 `computed` 实现的，因此定义的 `computed` 属性不能跟现有冲突，其次通过定义 `actions` 来定义组件修改 `store` 的 action，同样定义的 action 方法不能跟组件实例定义的 method 冲突。

**不允许外部直接修改 `store` 的 state，只能通过触发的 `action` 修改。**

目前实现机制，会导致每次 store 变更，computed 数据会重新计算，对于列表型数据，每次变更都会导致整个列表数据重新 `setData`，因此如果列表数据量比较大，可能会有性能问题。

此外，对于 `store` `state` 变更，对于引用类型，不能直接修改原来对象，然后返回之前数据对象，必须返回一个新的数据对象，否则会导致视图状态没有得到变更。**提示：** 由于 `微信小程序` 实现机制问题，可能即便你返回的还是之前的引用对象，在 `微信小程序` 下，发现还是会自动更新视图，但是在 `百度小程序` 及 `支付宝小程序` 是不会自动变更的。

```javascript
const removeTodo = (state, {id}) => {
    let found = findById(state, id);
    if (found === -1) {
        return state;
    }

    // 需要返回全新对象
    let newArr = [].concat(state);
    newArr.splice(found, 1);
    return newArr;

    // 错误实现: 直接返回之前的对象
    // state.splice(found, 1);
    // return state;
};
```
