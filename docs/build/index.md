# 构建配置

## 构建配置项

### verbose
`boolean` 是否打印详细的构建信息，默认 false，该选项设为 true，等价于 logLevel 设为 `info`

### root
`string` 项目构建的根目录，其它配置指定的路径信息，默认都是相对于该根目录

### framework
`Array.<string>` 扩展的原生小程序的框架，目前只支持 `okam-core` 提供的扩展

* `data`: 支持 `vue` 数据操作方式 及 `computed`(TODO: watch 支持暂未加上)
* `broadcast`: 支持广播事件
* `watch`: 提供 `watch` 属性 和 `$watch` API 支持，依赖 `data`
* `ref`: 允许模板指定 `ref` 属性，组件实例 `$refs` 获取引用，类似 Vue
* `redux`: 使用 `redux` 进行状态管理，要求安装依赖 `redux` 库：`npm i redux --save`, 另外，`redux` 依赖 `data` 扩展，因此需要一起配置
```javascript
{
    framework: ['data', 'watch', 'broadcast', 'ref', 'redux']
}
```

### polyfill
`Array.<string>` 要增加的语法 API polyfill，可选，目前框架默认支持两种:

* `promise`： 依赖 `promise-polyfill` 实现
* `async`: 依赖 `regenerator-runtime` 实现

### localPolyfill
`Array.<string>` 要增加的语法 API polyfill，可选，跟 `polyfill` 区别其实现不是全局挂载 API，而是在引用的脚本头部统一加上依赖的 API 变量，优先级高于 `polyfill`，一般用在无法在全局挂载 API 情况下，比如微信下在开启了 `es6->es5` 情况下：

```javascript
import Promise from 'okam-core/src/polyfill/promise';
// ...
```

目前框架默认支持两种:

* `promise`： 依赖 `promise-polyfill` 实现
* `async`: 依赖 `regenerator-runtime` 实现

### source
`Object` 项目源代码位置信息

* `source.dir`: `string` 项目源代码根目录，默认 `src`
* `source.exclude`: `Array.<string|RegExp>` 要 exclude 的文件
* `source.include`: `Array.<string|RegExp>` 要 include 的文件

### entry
`Object` 小程序入口配置

* `entry.script`: `string|RegExp` 入口脚本文件
* `entry.style`: `string|RegExp` 入口样式文件
* `projectConfig`: `string|RegExp` 项目配置文件

### output
`Object` 项目构建输出配置信息

* `output.dir`: `string` 输出的目标目录
* `output.depDir`: `string` 输出的 NPM 依赖文件存放的目录，相对于项目根目录
* `output.file`: `function(string, Object): boolean|string` 自定义输出文件路径，如果该文件不输出，返回 `false`

### component
`Object` 单文件组件的配置

* `component.extname`: `string` 组件的后缀名，默认 `okm`
* `component.template`: `Object` 模板配置项
* `component.template.transformTags`: `Object` 模板标签转换配置项

    **transformTags配置方式：以 `key-value` 形式添加**
    * `key`: 小程序标签名
    * `value`: 根据情况可配置为：`string|Object|Array` 类型
        * 单标签配置：`string、Object` 类型
            * 取值为 `string` 时，表示要被转的标签
            * 取值为 `Object` `时，Object` 的 `key` 可为：
                * `tag`: 需转换的 `tag`, 一般为 `HTML` 标签，
                * `class`: `class` 需额外附加 `classname`，`classname` 的样式需自行定义；
                * 其他属性: 需替换的属性名
        * 多标签配置：`Array`类型
            * `Array` 内部可为：`string、Object`类型，即 `单标签配置项` 取值

    默认不提供 标签转换支持，使用者可根据情况自定义配置

    配置示例：
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

### processors
`Object|Array.<Object>` 自定义的构建处理器，这里定义的处理器，后续的处理规则 `rules` 里，可以直接通过处理器名称 `name` 直接引用，处理器定义包含如下选项

* `name`: `string` 处理器名称，也可以指定内建的处理器名称，用来重写某些配置
* `processor`: `string|Function` 处理器 npm 包名、路径、或者实现（直接 require），也可以直接通过字符串形式引用 `builtin` 处理器，相当于定义了另外一个处理器，该处理器调用内建处理器
* `extnames`: `Array.<string>` 要使用该处理器处理的文件后缀名，`可选`
* `rext`: `string` 处理完输出的文件的后缀名，`可选`
* `deps`: `Array.<string>|string` 声明处理器的 NPM 依赖的包名，`可选`
* `options`: `Object` 处理器处理的默认选项定义，`可选`
```javascript
{
    // 传入对象形式，key: 为处理器的名称，其它内部定义同上面
    processors: {

        // 新增自定义的处理器
        myProcessor: {
            processor: 'okam-plugin-myProcessor'
            options: {}
        },

        // 重写已经存在的 stylus 处理器默认选项
        stylus: {
            options: {
                use(style) {
                    style.use(rider());
                }
            }
        },

        wxml2swan: {
            processor: 'view', // 使用内建的 view 模板处理器
            options: {
                plugins: [
                    'okam-template-plugin-xxx',
                    ['okam-template-plugin-xxx', {}]
                ]
            },
            extnames: 'wxml'
        }
    }
}
```

### rules
`Array.<Object>` 构建处理规则定义，每个规则项定义主要包含两部分

* `match`: `string|RegExp|function(Object):boolean` 自定义文件是否要处理，`match`也可以传要匹配的文件的 `glob pattern` 或者 `正则`。<br>
**注意：**匹配是按源文件路径匹配，而非处理器后的路径，如果要匹配单文件组件的 `template`、`script`、`style`， 可以按如下示例判断：（其中，`file.owner`有值，代表该`file`是从单文件组件中派生出来的文件，`owner`值为原单文件组件）<br>

```javascript
// 匹配单文件组件中的模板
file.isTpl && file.owner

// 匹配单文件组件中的样式
file.isStyle && file.owner

// 匹配单文件组件中的脚本
file.isScript && file.owner
```

* `processors`: `Array.<Object>|Object` 处理的文件要使用的处理器列表, 可以指定预定义的处理器名称，比如 `less`，`stylus`，具体参考[预定义处理器](#预定义的处理器)，也可以指定 [processors](build/index#processors) 定义的自定义处理器名称
```javascript
{
    rules: [
        {
            // match可以是正则、可以是字符串、可以是返回布尔值的函数
            // match: '*.styl',
            match(file) {
                if (file.isStyle && (!file.isEntryStyle && !file.owner)) {
                    // 如果文件是样式文件，但是非入口样式、非单文件组件的样式文件，则默认不处理
                    return false;
                }
                return !!file.processor;
            },

            // 数组元素顺序决定处理器执行顺序
            processors: [

                /**
                 * 动态确定要使用的处理器，返回默认的处理器名称，该规则也是内建的默认处理规则
                 */
                function (file) {
                    return file.processor;
                },

                // 如果没有附加处理器选项，可以直接指定处理器名
                'stylus',

                // 可以传入对象形式
                {
                    name: 'postcss', // 处理器名称
                    options: {}      // 处理器选项
                }，

                // 可以传入数组形式，第一个元素：处理器名称，第二个元素：处理器选项
                ['postcss', {}]

            ]
        }
    ]
}
```

!> 默认情况下，会根据文件的扩展名确定该文件要走什么处理器， 默认处理器即如上`processors`中的第一条处理器`file.processor`，具体可以参考[预定义处理器文件扩展名定义](build/index#预定义的处理器)。<br>而且这条规则是排在第一位，无法去掉该默认规则，因此如果你只是想改写某个处理器选项，比如 `stylus`，可以直接在跟 `rules` 平级的 [processors](build/index#processors) 配置里重写 `stylus` 处理器选项。如果想给 `stylus` 样式文件增加新的处理器比如 `postcss`，可以按如下方式来配置：

```javascript
{
    processors: {
        stylus: { // 重写 stylus 处理器选项
            options: {
                use(style) {
                    style.use(rider());
                }
            }
        },
        postcss: { // 重写 postcss 处理器选项
            options: {
                plugins: {
                    px2rpx: {
                        // 设计稿尺寸
                        designWidth: 1242
                    }
                }
            }
        }
    },
    rules: [
        {
            match(file) {
                // 处理入口样式及单文件组件的样式文件
                return file.isStyle && (file.isEntryStyle || file.owner);
            },
            // 为 stylus 样式文件新增 postcss 处理器，注意这里不需要加上 stylus 处理器
            // 默认已经内置了一条按文件名后缀关联处理器的规则
            processors: ['postcss']
        }
    ]
}

```

!> 默认处理规则是基于文件扩展名确定要使用的默认处理器，但对于样式默认只会处理入口样式文件和单文件组件的样式，即其它样式文件不会走任何默认处理器。

### watch
`boolean|Object`  监听文件变化处理器，要开启监听，需要在命令行提供 `--watch` 选项，默认提供了如下几个事件监听

* `ready`: 文件监听已经就绪
* `fileChange(filePath)`: 文件变化
* `fileAdd(filePath)`: 文件新增
* `fileDel(filePath)`: 文件删除
* `dirAdd(dir)`: 目录新增
* `dirDel(dir)`: 目录删除
* `error(err)`: 出错
```javascript
{
    watch: {
        fileChange(filePath) {
            // do sth.
        }
    }
}
```

### server
`Object` 自定义的开发 server 配置，可选

* `server.port`: `number` 本地开发 server 监听端口，可选，默认 8080
* `server.type`: `string` server 类型，默认支持如下几种
    * `express`: 需要安装相应的依赖 `npm i express --save-dev`
    * `koa`: 需要安装相应的依赖 `npm i koa --save-dev`
    * `connect`: 默认，需要安装相应的依赖 `npm i connect --save-dev`
* `server.middlewares`: `Array` server 的中间件，可选，中间件可以按如下格式签名定义
```javascript
{
    server: {
        port: 9090,
        type: 'express',
        middlewares: [
            {
                name: 'xxx', // 中间件的 npm 包名
                options: {}  // 创建中间件实例的选项
            },

            [
                'xxx',       // 中间件的 npm 包名
                {}           // 创建中间件实例的选项
            ],

            function () ()   // 直接传入中间间定义
        ]
    }
}
```

### dev
`Object` 开发阶段附加的构建配置，要求构建指定环境变量 `NODE_ENV` 为 `dev` or `development`

* `dev.processors`: `Object|Array.<Object>` 开发阶段附加的自定义处理器配置，同外层 `processors` 定义，会跟外层 processors 做合并
* `dev.rules`: `Array.<Object>` 开发阶段附加的处理规则配置，同外层 `rules` 定义，会跟外层 rules 做合并

### prod
`Object` 上线阶段附加的构建配置，要求构建指定环境变量 `NODE_ENV` 为 `prod` or `production`，具体配置定义同 `dev`

### 其它环境配置

可以根据 `NODE_ENV` 指定的值，自定义特定环境的配置，值同 `dev`，e.g, `NODE_ENV` 值指定为 `qa`，可以增加如下附加配置：

```javascript
{
    qa: {
        processors: {},
        rules: []
    }
}
```


## 预定义的处理器

> 预定义的处理器，有相关的依赖，如果用到了相应的处理器需要安装下面指定的依赖，比如 stylus 处理器，需要安装 `stylus` 依赖: `npm i stylus --save-dev`。

* 样式相关

    * less
        * 依赖：`less`
        * 默认扩展名：`less`
        * 处理器选项：参考官方 [less](http://lesscss.org/usage/#programmatic-usage)
    * stylus
        * 依赖：`stylus`
        * 默认扩展名：`styl`
        * 处理器选项：参考官方 [stylus](http://stylus-lang.com/docs/js.html)
    * sass
        * 依赖：`node-sass`
        * 默认扩展名：`sass`、`scss`
        * 处理器选项：参考官方 [sass](https://github.com/sass/node-sass)
    * postcss：css 后处理器，postcss 提供的内置插件参考[这里](#Postcss预定义插件)
        * 依赖：`postcss`
        * 处理器选项：参考官方 [postcss](https://postcss.org/)

* 组件相关

    * component：用来编译单文件组件的处理器，属于核心的处理器，不需要安装任何附加依赖
        * 默认扩展名：依赖于构建配置的 `component.extname` 定义
    * view：用来编译单文件组件的模板部分，转成原生小程序支持的模板语法，属于核心的处理器，不需要安装任何附加依赖
        * 默认扩展名：`tpl`

* 模板相关
    * pug: [pug](https://github.com/pugjs/pug) 模板语法支持，为了使使用该语法的模板能继续使用 `okam` 框架扩展的模板语法，需要增加如下配置
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

* 脚本相关

    * babel: babel6 转译处理器，组件编译默认需要依赖该处理器 或者 使用 `babel7` 也可以
        * 依赖：`babel-core`
        * ~~默认扩展名：`es`、`es6`~~
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
    * babel7
        * 依赖：`@babel/core`
        * ~~默认扩展名：`es`、`es6`~~
        * 处理器选项：参考官方 [babel](https://babeljs.io/docs/en/v7-migration)
    * typescript
        * 依赖：`@babel/core` `@babel/preset-typescript`
        * 默认扩展名：`ts`
        * typescript 语法：参考官方 [typescript](https://www.typescriptlang.org/)

* 其它

    * json5：将 `json5` 语法转成 `json`
        * 依赖：`json5`
        * 默认扩展名：`json5`
    * replacement：内容替换处理器
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

## Postcss预定义插件

* autoprefixer
    * 需要安装依赖：`npm i autoprefixer --save-dev`

* px2rpx：自动将 `px` 单位转成 `rpx`

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
