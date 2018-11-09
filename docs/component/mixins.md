# Mixins 支持

为了能够在组件之间复用一些方法和配置选项，可以通过 `mixins` 配置项方式混入可复用的组件方法配置。
Mixin 定义支持任何组件选项、生命周期钩子及其它自定义的方法，最终跟要混入的目标组件按一定策略进行合并。

目前原生小程序只支持自定义组件的 `mixins` 配置（对应原生的 `behaviors` ），`okam` 框架把 Page 组件 和 自定义组件做了统一，都支持 `mixins` 的配置，底层对于自定义组件基于原生 `Behavior` 实现，对于 Page 组件则直接在框架层面进行实现。**注意：** 对于内建的 mixin，比如 `wx://form-field`，由于不同端支持未统一，框架层面也未提供相应的兼容实现，因此使用时候请谨慎。

**注意：** `支付宝` 小程序目前未提供相应的内建 `mixin`，如果要多端兼容注意规避，其次支付宝的 `mixin` 策略跟 `微信` 和 `百度` 不同，要求多个 `mixin` 中的属性 `key` 要确保不同，否则会报错，即不同 `mixin` 在 `methods`、`data`、`props` 里彼此间不能存在同名的 `key`。

## Mixin 合并策略

关于组件 `mixins` 策略，可以参考[微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)。

`okam` 框架扩展了自己的一套生命周期钩子，其混入策略同原生小程序的钩子函数，扩展的 `computed` 属性混入策略同 `props`，组件本身的属性会覆盖混入对象的 `props` 中的属性。**注意：** 对于使用 `mixins`，要求 `props` 不能使用数组形式，即 `props: ['title', 'name']`，会被当做对象进行混入。

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

**提示：** 如果原生 Behavior 支持不完善或者有问题，不想使用原生 Behavior 实现，可以关闭原生的实现使用，用 `okam` 框架提供的内置实现替代，增加 `behavior` 插件扩展的选项 `'{useNativeBehavior: false}'`，注意第二个参数要求配置为字符串的代码，由于后续代码转译时候会插入该插件选项的代码片段。

```
{
     framework: [ ['behavior', '{useNativeBehavior: false}'] ]
}
```
