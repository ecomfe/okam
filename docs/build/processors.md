# 内置处理器

> 内置的处理器，有相关的依赖，如果用到了相应的处理器需要安装下面指定的依赖，比如 stylus 处理器，需要安装 `stylus` 依赖: `npm i stylus --save-dev`。

## 样式相关

* `less`
    * 依赖：`less`
    * 默认扩展名：`less`
    * 处理器选项：参考官方 [less](http://lesscss.org/usage/#programmatic-usage)
* `stylus`
    * 依赖：`stylus`
    * 默认扩展名：`styl`
    * 处理器选项：参考官方 [stylus](http://stylus-lang.com/docs/js.html)
* `sass`
    * 依赖：`node-sass`
    * 默认扩展名：`sass`、`scss`
    * 处理器选项：参考官方 [sass](https://github.com/sass/node-sass)
* `postcss`：css 后处理器，postcss 提供的内置插件参考[这里](#Postcss插件)
    * 依赖：`postcss`
    * 默认扩展名：`无`
    * 处理器选项：参考官方 [postcss](https://postcss.org/)

## 组件相关

* `component`：用来编译单文件组件的处理器，属于核心的处理器，不需要安装任何附加依赖
    * 默认扩展名：依赖于构建配置的 `component.extname` 定义
* `view`：用来编译单文件组件的模板部分，转成原生小程序支持的模板语法，属于核心的处理器，不需要安装任何附加依赖
    * 默认扩展名：`tpl`
* ~~`componentGenerator`~~`quickComponentGenerator`(`0.4.9`变更): `0.4 版本开始支持` 生成 `SFC` 处理器，相当于 `component` 处理器逆过程，`快应用` 核心处理器。

## 模板相关

* `pug`: [pug](https://github.com/pugjs/pug) 模板语法支持，为了让使用该语法的模板能继续使用 `okam` 框架扩展的模板语法，需要增加如下配置
    * 默认扩展名：`pug`
    ```javascript
    {
        processors: {
            pug: {
                options: {
                    doctype: 'xml',
                    data: {
                        name: 'efe-blue'
                    }
                }
            },
            view: {
                // 定义小程序模板转换的文件后缀名，加上这个才能确保能使用扩展的模板语法
                // 默认情况下， pug 处理器的优先级高于 view
                extnames: ['pug', 'tpl']
            }
        },
        rules: []
    }
    ```

## 脚本相关

* `babel`: babel6 转译处理器，组件编译默认需要依赖该处理器 或者 使用 `babel7` 也可以
    * 依赖：`babel-core`
    * 默认扩展名：`无`
    * 处理器选项：参考官方 [babel](https://babeljs.io/docs/en/babel-core)
    * 对于 `plugins` 选项进行了扩展支持传入 `function`，可以根据文件自定义要返回的附加的 babel 插件：
    ```
    {
        processors: {
            babel: {
                options: {
                    plugins(file) {
                        if (file.path.indexOf('src/') === 0) {
                            return [
                                'external-helpers'
                            ];
                        }
                    }
                }
            }
        }
    }
    ```
* `babel7`
    * 依赖：`@babel/core`
    * 默认扩展名：`无`
    * 处理器选项：参考官方 [babel](https://babeljs.io/docs/en/v7-migration)
* `typescript`
    * 依赖：`@babel/core` `@babel/preset-typescript`
    * 默认扩展名：`ts`
    * typescript 语法：参考官方 [typescript](https://www.typescriptlang.org/)

## 配置相关

* `componentJson`: 组件配置处理器，属于内部核心处理器
* `configJson`: `0.4 版本开始支持` 能够撰写特定平台配置的核心处理器，具体可以参考[特定平台配置](advance/platformSpecCode#配置)
* `quickAppJson`: `0.4 版本开始支持` 快应用配置核心处理器

## 其它处理器

* `json5`：将 `json5` 语法转成 `json`
    * 依赖：`json5`
    * 默认扩展名：`json5`
* `replacement`：内容替换处理器
    * 依赖：无
    * 处理器选项: `Object|Array` 参考下面示例
    ```javascript
    {
        rules: [
            match: '*.js',
            processors: [
                {
                    name: 'replacement',
                    options: {
                        'http://online.com': 'http://test.com',
                        'http://online.com': '${devServer}'
                    },
                    options: [
                        // 可以是 function
                        function (content) {
                            return content;
                        },

                        {
                            match: 'xx', // 支持正则或者字符串
                            replace: 'xx'
                        }
                    ]
                }
            ]
        ]
    }
    ```

## Postcss插件

* `env`: `0.4 版本开始支持` 撰写特定平台相关的样式代码的核心插件，具体可以参考[这里](advance/platformSpecCode#样式)，为了使用该插件，可以按如下方式引入该插件

    ```javascript
    {
        processors: {
            postcss: {
                options: {
                    plugins: ['env']
                }
            }
        }
    }
    ```
* `quickcss`: `0.4.11 版本开始支持` 引入该插件，会自动修复一些快应用不支持的写法，关于快应用样式支持可以参考[这里](https://doc.quickapp.cn/widgets/common-styles.html)
    * 背景样式 `background` 定义会自动展开，由于快应用不支持合并的写法：[具体参考这里](https://doc.quickapp.cn/widgets/background-img-styles.html)，比如 `background: url(./img.png) no-repeat` 会转成 `background-image: url(./img.png); background-repeat: no-repeat;`
    * 快应用颜色值不支持缩写：比如 `background-color: #2dd` 会转成 `background-color: #22dddd`，目前会对 `background` 及 `border` 相关样式的 `color` 进行处理；
    * `border` 样式：快应用不支持 `none` 写法会自动转成 `0`，此外快应用不支持 `border-left/border-right/border-top/border-bottom` 合并写法，会被自动展开，比如 `border-left: 1px solid #ccc` 会转成 `border-left-width: 1px; border-left-style: solid; border-left-color: #cccccc;`
    * `font-weight`: 快应用不支持 `数字` 写法，会自动转成 `normal` `bold` 取值，`<600` 会转成 `normal`，`>=600` 会转成 `bold`
    * `display`: 快应用只支持 `flex`，`block` 值会自动转成 `flex`
    * `position`: 快应用只支持 `fixed`，`absolute` 会自动转成 `fixed`

* `autoprefixer`
    * 需要安装依赖：`npm i autoprefixer --save-dev`

* `px2rpx`：自动将 `px` 单位转成 `rpx`

```javascript
{
    rules: [
        match: '*.css',
        processors: {
            postcss: {
                plugins: {
                    autoprefixer: {
                        browsers: [
                            'last 3 versions',
                            'iOS >= 8',
                            'Android >= 4.1'
                        ]
                    },
                    px2rpx: {
                        // 设计稿尺寸
                        designWidth: 1242,
                        // 开启 1px 不转, 即有 1px 的数字不会进行转换
                        // 开启 1px 不转, okam-build 0.4.6 版本开始支持
                        noTrans1px: true,
                        // 保留的小数点单位, 默认为 2
                        precision: 2
                    }
                }
            }
        }
    ]
}
```

如果使用的是 `stylus` 等预处理样式语言，可以按如下配置来配合 `postcss` 使用：

```javascript
{
    processors: {
        postcss: {
            // 指定要处理的后缀，默认情况下 `stylus` 处理器执行优先级高于 `postcss`
            extnames: ['styl', 'css'],
            options: {
                // ...
            }
        }
    },
    rules: [
        // ...
    ]
}
```
