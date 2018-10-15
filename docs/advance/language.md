# 语言扩展

## Promise 支持

百度小程序目前运行环境是支持 `Promise`，因此不需要加上 Polyfill。如果小程序运行环境无法保证 100% 支持 `Promise`，为了使小程序能够支持 `Promise`，需要引入对 `Promise` 支持的 Polyfill，只需要在构建配置文件 `swan.config.js` 加上如下配置：

```javascript
 {
    polyfill: ['promise']
}
```

## Asyn Await 支持

为了让小程序能支持 ES7 的 `async await` 语法，同样需要引入相应的 Polyfill，由于其实现是依赖于 Promise，因此如果 Promise 也需要提供支持的话，也需要把 Promise 的 Polyfill 加上：

```javascript
{
    polyfill: ['promise', 'async'] // 如果不需要对 Promise 进行 Polyfill，只需要保留 `async` 即可
}
```


## ES Next 支持

为了支持更新的 ES 语法，可以自定义对应的 `Babel` 处理器的转译选项，默认使用 `Babel6`，若要使用 `Babel7`，请将处理器名称替换成 `babel7`:

```javascript
{
    processors: {
        babel: { // 如果使用 babel7，将这里 babel 替换成  babel7
            extnames: ['js'],
            options: {
                presets: ['env'],
                plugins: [
                    'transform-class-properties',
                    'transform-decorators-legacy'
                ]
            }
        }
    }
}
```

由于默认的构建处理规则，会根据文件后缀名返回默认的处理器，而文件默认处理器是基于上述 `processors` 的 `extnames` 定义的，因此可以直接在 `processors` 构建配置项里直接声明默认的构建选项，此外，你也可以通过构建规则来定义：

```javascript
{
    rules: [
        {
            match: 'src/**/*.js',
            processors: [
                {
                    name: 'babel7',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            ]
        }
    ]
}
```

!> 由于文件编译处理依赖的解析器不是内置的，因此需要自行安装，比如如果用了 `Babel7` 需要安装依赖 `@babel/core`，具体可以参考[构建章节](build/index.md)。

## Typescript 支持

为了使小程序支持 `typescript`，默认情况下，只需要将文件的后缀名改成 `ts`，组件文件的 `script` 的 `lang` 属性指定为 `typescript` 或者 `ts` ：

```
<template></template>
<script lang="ts">
export default {

};
</script>
<style></style>
```

!> Typescript 语言转译依赖 babel7，因此需要安装相应的依赖：`@babel/core`、`@babel/preset-typescript`


## 预处理样式语言支持

开发框架默认提供了如下几种预处理语言支持：

* Less：需要安装相应的 `less` 依赖： `npm i less --save-dev`

* Stylus： 需要安装相应的 `stylus` 依赖: `npm i stylus --save-dev`

* Sass： 需要安装相应的 `node-sass` 依赖: `npm i node-sass --save-dev`

不需要修改任何构建配置，只需要将文件的后缀名改成对应的预处理语言的文件后缀名，比如 `app.styl`，组件文件的 `style` 的 `lang` 属性指定为相应的预处理样式语言名称：`less`、`stylus` 或者 `sass`。

```
<template></template>
<script>
export default {
};
</script>
<style lang="stylus">
.test-wrap
    .btn
        width: 300px
</style>
```
