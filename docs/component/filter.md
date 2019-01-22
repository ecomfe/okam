# Filter 支持

!> 要求 `okam-build` 版本号至少 `0.4.7`

`filter` 实现依赖于原生支持，目前只支持 `百度小程序` `微信小程序` `支付宝小程序` `快应用`（`okam-build@0.4.9` 开始支持），然后各个小程序平台对于 `filter` 或者 自定义脚本支持稍有差异，使用时候也需要注意下。

`filter` 定义目前只支持`本地 filter` 定义，暂不支持 `全局 filter`，`filter 定义` 同 [MVVM 框架 San](https://baidu.github.io/san/tutorial/component/#%E8%BF%87%E6%BB%A4%E5%99%A8)。

此外，`okam` 也支持原生的百度小程序 filter 及微信、支付宝自定义脚本的写法。

## 构建配置修改

在构建配置 `framework` 选项里加上 `filter` 支持：

```
{
    framework: ['filter']
}
```

## Filter 定义

* 脚本里 `filters` 属性里定义要用到的 filter
* 模板里使用 `Vue` filter 管道语法进行 filter 使用
* **注意：** `filters` 配置不支持 `mixin`

**使用注意：** `filter` 语法在属性上不支持 `{{}}` 使用，因此必须使用 `Okam` 数据绑定语法：`:attr="value | filter"`，对于 `attr="{{value | filter}}"` 写法是不支持的。此外，不要在 `filter` 语法上使用各种复杂的表达式，比如 `:style="{fontSize: value | filter}"`，不支持跟其它表达式混用，只能用来定义 filter 语法。

```
<template>
    <view class="filter-wrap">
        <view :class="obj | normalizeClass(flag)">raw: {{str}}, filter: {{str | toUpperCase}}</view>
        <filter-component :from="str|toUpperCase"></filter-component>
    </view>
</template>

<script>
import FilterComponent from './FilterComponent';

export default {
    config: {
        title: 'Filter 支持'
    },

    components: {
        FilterComponent
    },

    data: {
        str: 'abc3r23',
        flag: true,
        obj: {}
    },

    // 通过 filters 属性，声明过滤器，这部分定义最后会提取到自定义脚本文件，因此定义方式
    // 注意参考官方语法
    filters: {
        toUpperCase(str2) {
            return str2.toUpperCase();
        },
        normalizeClass(obj, flag) {
            // do sth.
        }
    },

    methods: {
    }
};
</script>

<style lang="stylus">
.filter-wrap
    height: 100vh
    padding: 10px
    background: #fff
</style>
```

* 基于脚本 `filters` 属性声明要使用的 `filter`，注意该 filter 定义，经过构建后会被提取到单独的自定义脚本文件里，模板通过自定义脚本的方式引入。

* **百度小程序** 不支持多个 filter 级联使用，必须使用 ES6 模块语法定义，不支持常量，只支持 function
* **微信小程序** 只支持 ES5 语法定义方式，包括导出 filter 方式用的是 `commonjs` 模块方式，因此需要在构建配置里单独将其转成 ES5 语法

    ```javascript
    // 微信构建配置
    {
        processors: {
            babel7: {
                extnames: 'js'
            },

            filter: {
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }
    }
    ```

## 原生 Filter 支持

* 百度小程序 Filter 支持
    ```
    <template>
        <view class="native-filter-wrap">
            <filter src="../filter/util.filter.js" module="util"></filter>
            <view>{{str}}: {{util.toUpperCase(str)}}</view>
            <filter module="util2">
                export default {
                    toLowerCase(str) {
                        return str.toLowerCase();
                    }
                }
            </filter>
            <view>{{str}}: {{util2.toLowerCase(str)}}</view>
        </view>
    </template>
    <script>
    export default {
        config: {
            title: '原生 Swan Filter 支持'
        },
        data: {
            str: 'aCs'
        }
    };
    </script>
    ```

* 微信自定义脚本支持

    ```
    <template>
        <view class="native-filter-wrap">
            <wxs src="../filter/util.wxs" module="util"></wxs>
            <view>{{str}}: {{util.toUpperCase(str)}}</view>
            <view>{{str}}: {{util.toLowerCase(str)}}</view>
            <view>fitler nested {{str}}: {{util.toUpperCase(util.toLowerCase(str))}}</view>
            <view>{{util.info}}</view>
            <wxs module="m1">
            var getMax = function(array) {
                var max = undefined;
                for (var i = 0; i < array.length; ++i) {
                    max = max === undefined
                        ? array[i]
                        : (max >= array[i] ? max : array[i]);
                }
                return max;
            }
            module.exports.getMax = getMax;
            </wxs>
            <view>{{m1.getMax(arr)}}</view>
        </view>
    </template>
    <script>
    export default {
        config: {
            title: '原生 Weixin Filter 支持'
        },
        data: {
            str: 'aCs',
            arr: [4, 18, 2]
        }
    };
    </script>
    ```

* 支付宝自定义脚本支持

    ```
    <template>
        <view class="native-filter-wrap">
            <import-sjs from="../filters/util.sjs" name="util"></import-sjs>
            <view>{{str}}: {{util.toUpperCase(str)}}</view>
            <view>{{str}}: {{util.toLowerCase(str)}}</view>
            <view>fitler nested {{str}}: {{util.toUpperCase(util.toLowerCase(str))}}</view>
            <view>{{util.info}}</view>
        </view>
    </template>
    <script>
    export default {
        config: {
            title: '原生 Ant Filter 支持'
        },
        data: {
            str: 'aCs'
        }
    };
    </script>
    ```

## 参考

* [San Filter定义](https://baidu.github.io/san/tutorial/component/#%E8%BF%87%E6%BB%A4%E5%99%A8)
* [百度小程序 Filter](https://smartprogram.baidu.com/docs/develop/framework/view_filter/)
* [微信小程序自定义脚本](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxs/)
* [支付宝小程序自定义脚本](https://docs.alipay.com/mini/framework/sjs)
