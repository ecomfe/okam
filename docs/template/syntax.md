# 模板语法

## 标签语法

百度智能小程序和微信小程序都只允许使用SWAN组件规定的标签。但是为了使得开发过程中，更加语义化、模板层次结构更清晰，`okam`提供配置项支持标签控制转换，让使用者可以直接`HTML`标签，经模板被编译后，配置标签项会被映射为小程序所支持的标签；
根据项目情况及自身习惯，可通过在配置文件中添加 `component.template.transformTags` 配置项进行定制化转换支持:

如在 `swan.config.js` 加上以下配置即可：
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

**常用配置项推荐:**

``` javascript
{
    component: {
        template: {
            transformTags: {
                // div p 将转为 view 标签
                view: ['div', 'p'],
                // a 将标签转为 navigator 标签，href 属性 转为 url 属性
                navigator: {
                    tag: 'a',
                    href: 'url'
                },
                // img 将转为 image 标签
                image: 'img'
            }
        }
    }
}
```

更多标签支持，可配置为：

``` javascript
{
    component: {
        template: {
            transformTags: {
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
                navigator: {
                    tag: 'a',
                    href: 'url'
                },
                image: 'img'
            }
        }
    }
}
```

配置项写法使用说明参见[配置定义 `component.template.transformTags` 部分](build/index#component)

**注意：** 目前转换只是模板层面转换，对于样式里存在 HTML 标签选择器是不会做相应的转换，因此样式选择器不允许使用 HTML 的标签选择器，请使用 `class` 或 内联 `style`。

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

## 数据绑定

* 基础数据

和百度智能小程序、微信小程序原生绑定方式一致，使用`{{}}`包裹 data 中的属性，`{{}}`中支持的简单运算的类型。
```html
<view>{{name}}</view>
```

* 动态属性

对于属性上的动态值，可以使用`:`指令绑定。动态值无需再用`{{}}`包裹
```html
<view :checked="dynamic"></view>
```

* 控制属性

在指令`if`、`elif`、`else`、`for`上的数据无需 `{{}}` 包裹

```html
<view if="flag"></view>
```

* 表达式

同百度智能小程序、微信小程序，且受限于它们，支持以下简单表达式：

   -- 数据访问(普通变量、属性访问)：`name` `array[0]` `object.a`<br>
   -- 逻辑运算符：`&& || !` <br>
   -- 算术运算: `+ - * / %`<br>
   -- 比较运算符: `> < >= <= === == !== != `<br>
   -- 条件运算符: `条件 ? 值1 : 值2`<br>
   -- 括号: `(1 + 2) * 3`<br>
   -- 字符串: `'hello' "hi "+"okam"` <br>
   -- 数值: `1`<br>
   -- 布尔: `true`<br>
   -- 字面量对象：如下

   ```
   <view :data-a="{a: 1, b: 2}">普通对象</view>
   <view :data-a="{foo, bar}">key和value相同的对象</view>
   <view :data-b="{...object, e: 5}">带扩展运算符的对象</view>
   ```

* 不支持

!>  不支持一次性插值语法（对应 Vue 的 `v-once` 指令）；<br>
    不支持原始 HTML； <br>
    不支持调用函数（包括Javascript对象上的函数及在JS逻辑层代码method中声明的函数）；<br>
    不支持过滤器（可通过computed 实现）；
