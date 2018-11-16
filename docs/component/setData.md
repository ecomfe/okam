# 数据操作

> 如无特殊说明，下述 `this` 都是指代 `Page` 或者 `Component` 实例上下文


## 准备工作

默认情况下，框架并没有提供下述提供的数据操作方法，因此需要修改构建配置，在构建配置 `framework` 选项里加上 `data` 支持，以启用该扩展：

```
{
    framework: ['data']
}
```

## 初始化

默认情况下，`data` 的初始化同原生小程序， `data` 也支持定义成 `function` ，但由于小程序实现机制限制，`data` 定义的 `function` 上下文不是组件实例的上下文，而是组件定义导出的对象，因此不建议在该方法里去访问实例提供的方法。

```javascript
export default {
    data: {
        num: 2
    },

    data() { // function 也是支持的，但当前上下文 `this` 非组件实例上下文，无法访问当前实例的任何 API
        return {
            num: 2
        };
    }
};
```

## 基本操作

原生小程序通过 `setData` `getData` API 来修改、获取数据，`setData` API 会引起视图层的自动更新；
okam 提供 `this.xxx` 方式直接访问数据，以及直接赋值来进行数据修改，并提供一些扩展数据操作方法，同 Vue。

* get 数据

`this.xxx` 等价于原生 `this.getData('xxx')`, 数据 `xxx` 需为 `data` 或 `props` 中定义的数据字段。

* set 数据

`this.xxx = value` 等价于原生 `this.setData('xxx', value)` 或者 `this.setData({xxx: value})`, 数据属性需为 `data` 或 `props` 中定义的数据


**注意：** 微信小程序对于数据操作 API 语法上跟百度小程序有些不同，比如没有 `getData` API，`setData` 只支持传入对象形式，如果考虑同时支持微信和百度小程序，可以使用扩展的数据操作语法，不使用原生语法保证兼容性，或者在使用原生语法上注意规避不兼容的语法。

## 对象操作

修改对象数据，可以直接按 JS 操作对象方式进行直接修改，e.g., `this.obj.name = 'xxx'`，等价于原生 `this.setData('obj.name', 'xxx')`。

## 数组操作

提供一组数据操作变异方法，为了能实现数组数据修改能自动触发视图更新，变异方法同 Vue，变异 API 使用同原生的 [Array API](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)。

* `push`: 在数组末尾插入一条数据
* `shift`: 在数组开始弹出一条数据
* `unshift`: 在数组开始插入一条数据
* `pop`: 在数组末尾弹出一条数据
* `splice`: 向数组中添加或删除项目
* `sort`: 对数组中数据进行排序
* `reverse`: 对数组中数据进行反序

**注意：**

以下两种操作，不能直接触发视图自动更新，即数据修改不是响应式的：

```javascript
this.arr[0] = 23;
this.arr.length = 2;
```

针对第一种操作，你可以使用 `splice` API 实现等价操作：

```javascript
this.arr.splice(0, 1, 23);
```

针对第二种操作，同样你也可以使用 `splice` API 实现等价操作：

```javascript
this.arr.splice(2);
```


## 计算属性

当某数据项的值由其他数据项计算得来时可通过 `computed` 定义实现；代码中可通过 `this.计算属性名` 来引用，模板中也可通过`{{ 计算属性名 }}` 来绑定数据

```
<template>
    <view>Hello: {{name}}</view>
    <button @click="onClick">Say Hi</button>
    <button @click="updateAPlusValue">更新: {{a}} - {{aPlus}}</button>
</template>
<script>
export default {
    data: {
        firstName: 'Jack',
        lastName: 'Lee',
        a: 1
    },

    computed: {
        name() {
            // ...
            return this.firstName + ' ' + this.lastName;
        },

        // 也可以使用 arrow function
        myName: vm => (vm.firstName + ' ' + vm.lastName),

        // 支持定义 setter
        aPlus: {
            get: function () {
                return this.a + 1
            },
            set: function (v) {
                this.a = v - 1
            }
        }
    },

    methods: {
        onClick() {
            this.$api.showToast({
                title: `hi: ${this.name}`,
                duration: 3000
            });
        },

        updateAPlusValue() {
            this.aPlus = 9; // 设置计算属性的值
        }
    }
}
</script>
```

!> 计算数据的函数中目前可以依赖 `data` `prop` 定义的数据项的值，访问方式必须 `this.xxx`，不能用原生小程序方式 `this.data.xxx`，否则会无法收集到依赖，不能在该方法变更其它状态的数据，即 set 组件数据

## 监听器

为了使用监听器功能，需要修改构建配置，在构建配置 `framework` 选项里加上 `watch` 选项，以启用该扩展，该扩展是依赖 `data` 扩展，因此需要同时加上 `data` 扩展：

```
{
    framework: ['data', 'watch']
}
```

一般情况下，使用 `computed` 基本能解决大部分业务场景问题，如果存在某些数据依赖需要异步去拉取数据更新，可以使用 `watch` 属性和 `$watch` API：

* `watch` 属性

    * watch key 为对应 watch 的表达式，e.g., 'obj.a'
    * watch key 的 value 支持如下几种类型
        * `string`: watch 回调的处理器名，需要在该组件实例上下文定义，e.g, `{watch: {arr: 'handleArrChange'}}`
        * `function(newVal, oldVal)`: watch 的回调处理器，执行上下文为组件实例，**注意：** 对于 `数组` 或者 `对象` 的 `newVal` 和 `oldVal` 是指向同一引用，如果只是内部值变化的情况下
        * `Object`: 对应的结构 `{handler: Function, deep: boolean, immediate: boolean}`，`handler` 对应的 watch 回调，`deep` 和 `immediate` 同 `$watch` API 见下述 `options` 定义

* `$watch(expressOrFunc, callback, options):Function`：返回 `unwatch` 接口可以用来移除对表达式或者自定义 function 的 watch

    * `expressOrFunc`: 要观察的表达式或者自定义 function
    * `callback`: watch 到变化执行的回调
    * `options`: watch 选项

        * `options.deep`: `boolean` 默认 false，如果需要 watch 对象内部值变化，需要设为 `true`，**数组不需要**
        * `options.immediate`: `boolean` 默认 false，如果设为 true，会立即触发 `callback` 执行

```javascript
export default {
    data: {
        arr: [],
        obj: {
            a: 3,
            b: {
                c: 'str'
            }
        },
    },

    computed: {
        subObj() {
            return this.obj.b;
        }
    },

    watch: {
        arr: 'handleArrChange',

        subObj: {
            handler(newVal, oldVal) {
                // do sth.
            },
            immediate: true
        },

        obj: {
            handler(newVal, oldVal) {
                // do sth.
            },
            deep: true
        },

        'obj.a': {
            handler(newVal, oldVal) {
                // do sth.
            }
        }
    },

    created() {
        // using $watch API
        this.$watch('arr', function (newVal, oldVal) {
            // do sth.
        });

        // add watch options
        this.$watch('obj', function (newVal, oldVal) {
            // do sth.
        }, {deep: true, immediate: true});

        // using watch function
        this.$watch(function () {
            return this.obj.b.c;
        }, function (newVal, oldVal) {
            // do sth.
        }, {deep: true, immediate: true});
    },

    methods: {
        handleArrChange(newVal, oldVal) {
            // do sth.
        }
    }
};

```

## $nextTick

组件数据变更后，将在下一个时钟周期更新视图；如果你修改了某些数据，想要在 DOM 更新后做某些事情，可以使用 $nextTick 方法


``` javascript
{
    methods: {
        myFn() {
            this.name = 'Tom';

            // DOM 还未更新

            this.$nextTick(() => {
                // DOM 更新
                // todo
            });
        }
    }
}
```

