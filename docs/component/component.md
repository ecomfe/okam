# 自定义组件

> 自定义组件实现是基于原生小程序提供的自定义组件支持。

* 创建自定义组件，假设自定义组件文件为：`src/components/Hello.okm`

* 在需要使用自定义组件的 Page 或者 自定义组件里通过类似 `Vue` 的 `components` 配置方式声明引入

经过 okam 构建工具，`Hello.okm` 最终会被构建生成四个文件，在 `components` 目录下：`Hello.js、Hello.json、Hello.swan、Hello.css`

## 组件定义

自定义组件也是单文件组件开发方式，主要由三部分：`<template>`, `<script>`, `<style>` 组成

* `<template>`
    * 基础语法详见：[模板语法介绍](template/syntax.md)

* `<style>`
    * 样式定义跟原生小程序保持一致
    * 可以根据框架提供的[语言扩展](advance/language.md)，使用 `stylus` 或者 `less` 等各种预处理语言，通过`lang="stylus"`来区分使用的预处理语言
    * 更多进阶处理，参见：[样式相关处理](advance/rpx.md)

* `<script>`
    * 不需要原生 `Component({})` 方式进行包裹，只需要导出对应的入口脚本定义即可
    * Component 上下文依旧是原生小程序上下文，因此定义同原生小程序
    * `properties` 简写为 `props` 字段
    * Component 实例扩展 Api 支持 [详见-扩展 API](component/component.md?id=扩展 API)
    * 主要属性支持

|属性|说明|
|---|---|
|config|Component 的配置对象, 可以不用设置，定义同原生小程序自定义组件的 `json` 配置文件。[详见-页面配置](component/component.md?id=页面配置)|
|components|Component 的子组件配置对象，声明 Component 可使用的子组件列表，将自动生成 `.json` 中组件配置定义。[详见-页面配置](component/component.md?id=页面配置)|
|props|Component 外部渲染数据对象，用于模板绑定外部渲染数据, 同原生的 `properties` 对象|
|data|Component 内部渲染数据对象，用于模板绑定内部渲染数据。[详见-数据操作](component/setData.md)|
|computed|Component 计算数据对象，声明组件中一个数据项的值需要由其他数据项计算得来的计算数据。[详见-计算属性](component/setData.md?id=计算属性)|
|生命周期| 生命周期函数，包含 `created、mounted、destroyed` 等类 Vue 的一系列生命周期支持。[详见-生命周期](component/component.md?id=生命周期)|
|methods|组件的方法，包括事件响应函数和任意的自定义方法[详见-事件处理及自定义函数](component/component.md?id=事件处理及自定义函数)|


```
<template>
    <view class="hello-wrap">
        <text class="title">Hello Title</text>
        <slot name="top"></slot>
        <slot></slot>
        <button class="btn" @click="handleClick">{{source}}-{{num}}</button>
        <slot name="bottom"></slot>
    </view>
</template>
<script>

export default {
    config: {},

    components: {},

    props: {
        source: {
            type: String,
            default: 'Baidu'
        },
        num: {
            type: Number
        }
    },

    options: {
        // 在组件定义时的选项中启用多slot支持
        multipleSlots: true
    },

    data: {
        title: 'xxx'
    },

    // 生命周期
    beforeCreate() {},
    created() {},
    beforeMount() {,
    mounted() {},
    beforeDestroy() {},
    destroyed() {},

    methods: {
        handleClick(...args) {
            console.log("click in Hello", args);
            this.sayHi();
            this.$emit('hi', {name: 'Jack'});
        },

        sayHi() {
            console.log('hi in', this.title);
        }
    }
}
</script>
<style lang="stylus">
</style>

```

## 组件配置

原生小程序 需在 `.json` 中设置 `component: true`，okam 无需在额外设置，也不需要声明依赖的自定义组件，即不需要配置 `usingComponents`。

!> 不在 `src/app.js` 入口文件 `config.pages` 声明的页面组件都会被当成自定义组件处理

## 生命周期
okam 保留了小程序组件生命周期, 同时提供了一套 vue 生命周期风格的写法

|生命周期|说明|注|
|---|---|
|beforeCreate| 在实例初始化之后，立即同步调用|created 前期|
|created| 实例已经创建完成之后被调用 |created 后期|
|beforeMount|在挂载开始之前被调用|attached 前期|
|mounted|在实例挂载之后调用|ready 后期|
|beforeUpdate|暂无|-|
|updated|暂无|-|
|activated|暂无|-|
|deactivated|暂无|-|
|beforeDestroy|实例销毁之前调用 | detached 前期|
|destroyed|实例销毁后调用 | detached 后期|

[原生小程序自定义组件生命周期](https://smartprogram.baidu.com/docs/develop/framework/custom-component_comp/)

!> Component 脚本执行的上下文还是原生小程序 Component 上下文，因此生命周期钩子，依旧可以使用原生提供的，但建议保持一致，要么都使用原生小程序钩子，要么都使用类 Vue 生命周期钩子，这样避免造成混乱。

## 组件 Props

`props` 定义参考 `Vue` 语法跟原生的有一定区别：

* `properties` 变为 `props`，更加简洁，支持数组形式

* `value` 变为 `default`，语义更清晰，支持 `function`，**执行上下文非组件**

* `type` 支持同原生小程序：`String`, `Number`, `Boolean`, `Object`, `Array`, `null`

* `observer` 不建议使用，默认支持父组件到子组件数据的单向同步

```javascript
export default {
    props: [
        'postTitle',
        'postSource'
    ],

    props: {
        arr: {
            type: Array,
            default() {
                return [1, 2, 3];
            }
        }
    }

    // 等价于
    properties: {
        postTitle: {
            type: null
        },
        postSource: {
            type: null
        }
    },

    properties: {
        arr: {
            type: Array,
            value: [1, 2, 3]
        }
    }
}
```

## 父子组件的数据传递

* 传递静态值
    ```父组件
    <template>
        <child str="abc"></child>
    </template>
    ```

    ```子组件
    <template>
        <view>{{src}}</view>
    </template>
    <script>
    export default {
        props: {
            str: String
        }
    }
    </script>
    ```

* 传递动态值，使用数据绑定语法 `:` 来传递动态值：

    ```父组件
    <template>
        <child :childTitle="title"></child>
    </template>
    <script>
    export default {
        data: {
            title: 'str'
        }
    }
    </script>
    ```

    ```子组件
    <template>
        <view>{{childTitle}}</view>
    </template>
    <script>
    export default {
        props: {
            childTitle: String
        }
    }
    </script>
    ```

* 单向数据流

    父组件数据通过 `props` 传递给子组件，一旦父组件数据发生变更，会自动把变更数据应用到子组件上，子组件视图也会自动更新。

    原则上，不建议子组件改变 `props` 数据，一旦修改，这些 `props` 数据不会反过来自动应用到父组件上，如果需要将子组件数据同步给父组件，建议使用事件方式来同步该数据状态：
    ```父组件
    <template>
        <child :num="num" @numChange="onNumChange"></child>
    </template>
    <script>
    export default {
        data: {
            num: 1
        },
        methods: {
            onNumChange(e) {
                this.num = e.detail.value;
            }
        }
    }
    </script>
    ```

    ```子组件
    <template>
        <view>{{num}}</view>
        <button @click="changeNum">change number</button>
    </template>
    <script>
    export default {
        props: {
            num: Number
        },
        methods: {
            changeNum() {
                this.$emit('numChange', 10);
            }
        }
    }
    </script>
    ```

    一般，有如下两个场景可能需要修改 `props` 数据：

    * 一种可能需要将传入的数据重新格式化展现或者其他目的，这种情况下，可以使用 `computed`
    ```javascript
    export default {
        props: {
            myTitle: String
        },
        computed: {
            normalizeTitle() {
                return this.myTitle.toLowerCase();
            }
        }
    }
    ```

    * 另外一种，可能需要将传入的属性数据作为子组件自身状态的一个初始值，后续子组件会自己维护该状态数据变更
    ```javascript
    export default {
        props: {
            initCounter: Number
        },
        data: {
            counter: 0
        },
        created() {
            this.counter = this.initCounter;
        }
    }
    ```

## 模板 slot
同[原生小程序 slot](https://smartprogram.baidu.com/docs/develop/framework/custom-component_temp/#%E7%BB%84%E4%BB%B6%E7%9A%84slot)

## 扩展 API

* `$api`: 挂载所有原生小程序 API，Page 上下文访问：`this.$api.xxx()` 等价于 `swan.xxx()`，建议小程序都摒弃特定小程序命名空间 API 访问方式，方便以后同一套代码转成其它平台端的小程序；
* `$global`: 小程序提供的全局对象；
* `$app`: app 实例
* `$http`: 封装了 `swan.request` 接口的 HTTP 请求接口；[详见-HTTP 请求](advance/http.md)
* `App` 入口文件声明 `Promise` 化，`Page` 能直接使用；[详见-Promise化 API](app/promise.md)
* data 操作语法类似于 Vue，支持 `computed`，`$nextTick`； [详见-数据操作](component/setData.md)
* 可通过 ~~`$broadcast`~~, `$emit` 进行组件通信，详见下面章节介绍


## 组件通信

* 触发事件

子组件触发事件，父组件进行事件接收，原生小程序 使用 ` this.triggerEvent('eventName', eventData);`，`okam` 框架使用 `$emit` 来进行事件触发。

使用：

``` javascript
this.$emit('eventName', eventData);
```

示例：

```
// 子组件
this.$emit('hi', {name: 'Jack'});

// 父组件
<template>
    <hello @hi="handleHi">
    </hello>
</template>

<script>
{
    methods: {
        handleHi(...args) {
            console.log('hi trigger...', args);
        }
    }
}
</script>
```


