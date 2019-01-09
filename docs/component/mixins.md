# Mixins 支持

为了能够在组件之间复用一些方法和配置选项，可以通过 `mixins` 配置项方式混入可复用的组件方法配置。
Mixin 定义支持任何组件选项、生命周期钩子及其它自定义的方法，最终跟要混入的目标组件按一定策略进行合并。

目前原生小程序只支持自定义组件的 `mixins` 配置（对应原生的 `behaviors` ），`okam` 框架把 Page 组件 和 自定义组件做了统一，都支持 `mixins` 的配置，底层对于自定义组件基于原生 `Behavior` 实现，对于 Page 组件则直接在框架层面进行实现。**注意：** 对于内建的 mixin，比如 `wx://form-field`，由于不同端支持未统一，框架层面也未提供相应的兼容实现，因此使用时候请谨慎。

**注意：** `支付宝` 小程序目前未提供相应的内建 `mixin`，如果要多端兼容注意规避，其次支付宝的 `mixin` 策略跟 `微信` 和 `百度` 不同，要求多个 `mixin` 中的属性 `key` 要确保不同，否则会报错（从 `0.4.7@okam-core` 开始，统一由 `okam` 框架提供默认的 `mixin` 实现，因此不存在报错情况），即不同 `mixin` 在 `methods`、`data`、`props` 里彼此间不能存在同名的 `key`。

!> 快应用 `0.4.7@okam-core` 开始 支持

!> `0.4.7@okam-core` 开始，默认所有 `okam` 的生命周期钩子都统一由 `okam` 完成 `mixin` （之前的 `created` 原生钩子由原生 `behavior` 实现），默认所有特殊属性 `data` `props` `computed` `methods` 都统一由 `okam` 完成 `mixin` (之前只有 `data` `props` `methods` 由原生 `behavior` 实现)，这样调整确保了所有平台的 `mixin` 策略一致性，而不依赖原生实现。

## Mixin 合并策略

关于组件 `mixins` 策略，可以参考[微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)。

`okam` 框架扩展了自己的一套生命周期钩子，其混入策略同原生小程序的钩子函数，扩展的 `computed` 属性混入策略同 `props`，组件本身的属性会覆盖混入对象的 `props` 中的属性。**注意：** 对于使用 `mixins`，要求 `props` 不能使用数组形式，即 `props: ['title', 'name']`，会被当做对象进行混入。

**注意：** `mixins` 策略，对于 `页面` 的 `onShow` 、`onHide` 等原生小程序提供的非生命周期钩子采用的 `mixin` 策略同其它普通的属性，暂不支持生命周期的混入策略（从 `0.4.7@okam-core` 开始，可以自定义要混入的钩子名称，参考下面构建配置说明）。

## Mixin 定义

```common/mixinA.js
export default {
    mixins: [], // mixin 里也可以引入其它 mixin
    props: {
        title: String
    },
    created() {

    },
    methods: {
        test() {

        }
    }
};
```

```common/mixinB.js
export default {
    props: {
        title2: String
    },
    created() {

    },
    methods: {
        test2() {

        }
    }
};
```

```pages/index.vue
<script>
import mixinA from '../common/mixinA';
import mixinB from '../common/mixinB';

export default {
    mixins: [mixinA, mixinB],
    created() {

    },
    methods: {
    }
};
</script>
```

## 构建配置修改

在构建配置 `framework` 选项里加上 `behavior` 支持：

```
{
    framework: ['behavior']
}
```

该扩展支持了如下几个配置属性，具体参考下面。

### useNativeBehavior

如果没有使用任何内置的 `mixin` 属性，比如 `wx://form` 之类的，期望所有属性的 `mixin` 策略都交由 `okam` 来实现，保证所有平台一致性，可以关闭原生的实现使用，增加 `behavior` 插件扩展的选项 `'{useNativeBehavior: false}'`（默认为 `true`），注意第二个参数要求配置为字符串的代码，由于后续代码转译时候会插入该插件选项的代码片段。

```javascript
{
     framework: [ ['behavior', '{useNativeBehavior: false}'] ]
}
```

**注意：** 默认情况下，除了框架支持的默认生命周期钩子及特殊属性（见下面）会由 `okam` 实现 `mixin`，其它属性字段都是走原生的 `mixin` (`behavior`) 实现。

### mixinHooks

该插件扩展，默认 `mixin` 生命周期钩子：

* beforeCreate
* created
* beforeMount
* mounted
* beforeDestroy
* destroyed
* beforeUpdate
* updated

如果想新增新的 `mixin` 钩子，可以在构建配置增加如下配置项：

```javascript
{
    framework: [ ['behavior', '{mixinHooks: ['onShow']}'] ]
}
```

如果想移除掉某些默认钩子的特殊 `mixin` 策略，改由原生实现，或者使用默认的 `mixin` 方式（`useNativeBehavior` 为 `false` 时候），可以传入对象方式：

```javascript
{
    // 新增 onShow 钩子 mixin，移除默认 okam mixin 的钩子 created
    framework: [ ['behavior', '{mixinHooks: {onShow: true, created: false}}'] ]
}
```

### mixinAttrs

该插件扩展，默认 `mixin` 特殊属性：

* data: `deepMerge` 策略
* methods: `merge` 策略
* props: `merge` 策略
* computed: `merge` 策略

如果想新增新的 `mixin` 属性，可以在构建配置增加如下配置项：

```javascript
{
    framework: [ ['behavior', '{mixinAttrs: ['myObj']}'] ]
}
```

**注意**: 如果新增的 `mixin` 属性，没有定义 `mixinStrategy`，会使用默认的 `merge` 策略。

如果想移除掉某些默认属性的特殊 `mixin` 策略，改由原生实现，或者使用默认的 `mixin` 方式（`useNativeBehavior` 为 `false` 时候），可以传入对象方式：

```javascript
{
    // 新增 myObj 属性 mixin，移除默认 okam mixin 的属性 data
    framework: [ ['behavior', '{mixinAttrs: {myObj: true, data: false}}'] ]
}
```

### mixinStrategy

自定义属性的 `mixin` 策略，默认 `okam` 对于要 `mixin` 的属性有默认的 `mixin` 策略，见 `mixinAttrs` 说明，如果期望改变其 `mixin` 方式，可以按如下配置进行实现：

```javascript
{
    // 修改 data 的 默认 mixin 策略
    framework: [ ['behavior', '{mixinStrategy: {data: (parent, target) => Object.assign({}, parent, target)}'] ]
}
```
