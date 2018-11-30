# 标签转换

如果想将模板标签做个简单转换，比如换个标签名等，可以使用构建配置 `component.template.transformTags` 配置。

> `>= 0.4 版本 `

**transformTags配置方式：以 `key-value` 形式添加**

* `key`: 被转的标签名，类型为：`string`
* `value`: 根据情况可配置为：`string|Object|` 类型
    * 取值为 `string` 时，表示转为的 `tag`
    * 取值为 `Object` 时，`Object` 的 `key` 可为：
        * `tag`: 转为的 `tag`,
        * `class`: `class` 需额外附加 `classname`，`classname` 的样式需自行定义；
        * 其他属性: 需替换的属性名

配置示例：小程序中 写 html 标签
``` javascript
{
    component: {
        template: {
            transformTags: {
                div: 'view',
                p: 'view',
                ul: 'view',
                ol: 'view',
                li: 'view',
                // span 会被转为 view 标签，若想让它拥有 inline 属性，可通过 配置 class 值如：okam-inline 进行 样式属性控制
                // 注：okam-inline 样式 需自行在样式文件(app.css)中定义
                // 最终 view 标签 class 将额外添加 okam-inline 值，而不是覆盖
                span: {
                    tag: 'view',
                    class: 'okam-inline'
                },
                h1: 'view',
                h2: 'view',
                h3: 'view',
                h4: 'view',
                h5: 'view',
                h6: 'view',
                article: 'view',
                section: 'view',
                aside: 'view',
                nav: 'view',
                header: 'view',
                footer: 'view',

                // Object
                /*
                    * eg
                    * <a class="home-link" href='xxx'></a>
                    * 转为:
                    * <navigator class="okam-inline home-link" url='xxx'></navigator>
                    */
                a: {
                    tag: 'navigator',
                    class: 'okam-inline',
                    href: 'url'
                },

                // string
                img: 'image'
            }
        }
    }
}
```

> `< 0.4 版本 `

建议升级更换至 0.4 以上，< 0.4 升级到 0.4及以上

**transformTags配置方式：以 `key-value` 形式添加**
* `key`: 要转成的标签名
* `value`: 根据情况可配置为：`string|Object|Array` 类型
    * 单标签配置：`string、Object` 类型
        * 取值为 `string` 时，表示被转的 `tag`
        * 取值为 `Object` 时，`Object` 的 `key` 可为：
            * `tag`: 被转的 `tag`, 一般为 `HTML` 标签，
            * `class`: `class` 需额外附加 `classname`，`classname` 的样式需自行定义；
            * 其他属性: 需替换的属性名
    * 多标签配置：`Array`类型
        * `Array` 内部可为：`string、Object`类型，即 `单标签配置项` 取值

配置示例：小程序中 写 html 标签
``` javascript
{
    component: {
        template: {
            transformTags: {
                // Array
                view: [
                    {
                        tag: 'span',
                        // span 会被转为 view 标签，若想让它拥有 inline 属性，可通过 配置 class 值如：okam-inline 进行 样式属性控制
                        // 注：okam-inline 样式 需自行在样式文件(app.css)中定义
                        // 最终 view 标签 class 将额外添加 okam-inline 值，而不是覆盖
                        class: 'okam-inline'
                    },
                    'div', 'p',
                    'ul', 'ol', 'li',
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'article', 'section', 'aside', 'nav', 'header', 'footer'
                ],

                // Object
                /*
                    * eg
                    * <a class="home-link" href='xxx'></a>
                    * 转为:
                    * <navigator class="okam-inline home-link" url='xxx'></navigator>
                    */
                navigator: {
                    tag: 'a',
                    class: 'okam-inline',
                    href: 'url'
                },

                // string
                image: 'img'
            }
        }
    }
}
```

** `0.4 以下` 与 `0.4及以上` 之间的配置兼容切换问题 **

`0.4及以上`想继续使用之前的调用方式，或 `0.4以下升级为0.4及以上`，可使用 `okam` 提供的 `reverseTagMap` 进行转换

``` javascript
const reverseTagMap = require('okam-build').reverseTagMap;

{
    component: {
        template: {
            transformTags: reverseTagMap({
                // Array
                view: [
                    {
                        tag: 'span',
                        // span 会被转为 view 标签，若想让它拥有 inline 属性，可通过 配置 class 值如：okam-inline 进行 样式属性控制
                        // 注：okam-inline 样式 需自行在样式文件(app.css)中定义
                        // 最终 view 标签 class 将额外添加 okam-inline 值，而不是覆盖
                        class: 'okam-inline'
                    },
                    'div', 'p',
                    'ul', 'ol', 'li',
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'article', 'section', 'aside', 'nav', 'header', 'footer'
                ],

                // Object
                /*
                    * eg
                    * <a class="home-link" href='xxx'></a>
                    * 转为:
                    * <navigator class="okam-inline home-link" url='xxx'></navigator>
                    */
                navigator: {
                    tag: 'a',
                    class: 'okam-inline',
                    href: 'url'
                },

                // string
                image: 'img'
            }
        })
    }
}
```

**注意：** 默认不提供 标签转换支持，使用者可根据情况自定义配置。 目前转换只是模板层面转换，对于样式里存在 HTML 标签选择器是不会做相应的转换，因此样式选择器不允许使用 HTML 的标签选择器，请使用 `class` 或 内联 `style`。

```
<template>
    <ul class="project-list">
        <li class="project-item" for="item in projectList">
            {{item.name}}
        </li>
    </ul>
</template>
<script>
// ...
</script>
<style>
.project-list li { // 样式选择器包含 HTML 标签 li，不支持
    padding: 10px 0;
}

.project-list .project-item { // 使用 class 选择器，支持
    padding: 10px 0;
}
</style>
```
