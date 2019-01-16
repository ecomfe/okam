## 单文件组件开发

> `okam` 采用单文件模式进行组件开发

原生小程序要求：

* app 实例必须有3个文件：
    `app.js、app.json、app.css`

* page 页面一般有4个文件：
    `page.js、page.json、page.swan、page.css`

* component 组件一般有4个文件：
    `component.js、component.json、component.swan、component.css`

* app实例的3个文件以及page页面的4个文件对应的文件名除后缀名外须同名，[具体可参看官方目录结构](https://smartprogram.baidu.com/docs/develop/tutorial/codedir/)。

使用单文件组件方式开发，可以使项目文件结构更清晰、简洁，具体可以对比下面目录结构。

## 目录结构

* 原生小程序目录结构

```
.
├── components
│   ├── Hello.css
│   ├── Hello.js
│   ├── Hello.json
│   └── Hello.swan
├── pages
│   |
│   ├── home
│   │   ├── index.js    index 页面逻辑
│   │   ├── index.json  index 页面配置
│   │   ├── index.swan  index 页面结构
│   │   └── index.css   index 页面样式
│   │ 
│   └── other
│       ├── detail1.js      detail1 页面逻辑
│       ├── detail1.json    detail1 页面配置
│       ├── detail1.swan    detail1 页面结构
│       └── detail1.css     detail1 页面样式
│       |
│       ├── detail2.js      detail2 页面逻辑
│       ├── detail2.json    detail2 页面配置
│       ├── detail2.swan    detail2 页面结构
│       └── detail2.css     detail2 页面样式
│ 
├── app.js              小程序逻辑
├── app.json            小程序公共配置
└── app.css             小程序公共样式
```

* `okam` 项目目录结构

```
.
└── src
    ├── components
    │   └── Hello.okm            Hello 组件逻辑、配置、结构、样式
    │ 
    ├── pages
    │   ├── home
    │   │   └── index.okm        index 页面逻辑、配置、结构、样式
    │   └── other
    │       ├── detail1.okm      detail1 页面逻辑、配置、结构、样式
    │       └── detail2.okm      detail2 页面逻辑、配置、结构、样式
    ├── app.js              小程序逻辑、公共配置
    └── app.css             小程序公共样式
```

## 组件文件结构

> okam 开发框架里 `Page` 跟 自定义组件都属于 `Component` 范畴，默认对应 `*.okm` 文件，组件文件后缀名可配置，定义类似于 `Vue`。

主要分三个部分：

* `template`: 对应 `page` 或者 `component` 的 `swan` 模板文件，模板语法可以参考 [模板定义](template/syntax.md)
* `script`：对应 `page` 或者 `component` 的脚本文件 及 配置文件，即 `script` 部分包含 `js` 和 配置 `json` 文件两部分内容
    * `lang`：可通过该属性自定义脚本使用的语言，比如使用 `ts`: `<script lang="typescript"></script>`
    * `config`：对应 json 配置文件
* `style`: 对应 `page` 或者 `component` 的样式文件
    * `lang`: 可通过该属性自定义样式的预处理语言

```
<template>
   <!-- 结构 -->
</template>

<script>
export default {
    // 配置等价于原生的 json 配置
    config: {
    },

    // 数据
    data: {
    },

    // 逻辑
    method: {
    }
};
</script>

<style lang="stylus">
    /* 样式 */
</style>
```

## 组件文件后缀名自定义

* 组件文件后缀名默认为 `.okm`，可在构建配置文件 `swan.config.js` 通过 `component.extname` 配置其它后缀

``` javascript
{
    component: {
        // 配置为 .vue 后缀
        extname: 'vue'
    }
}

```





