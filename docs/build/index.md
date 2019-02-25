# 构建配置

## 构建配置项

构建配置项，在 `script/*.config.js` 文件中进行配置

以 `okam-cli` 构建的项目目录为例

```
.
└─ scripts                // 构建相关脚本
    ├── build.js          // 构建入口脚本
    ├── build.sh          // CI 脚本
    ├── base.config.js    // 基础公共构建配置文件
    ├── tt.config.js      // 头条小程序构建配置文件
    ├── init-quick-app.js // 快应用项目初始化脚本
    ├── quick.config.js   // 快应用构建配置文件
    ├── ant.config.js     // 支付宝小程序构建配置文件
    ├── wx.config.js      // 微信小程序构建配置文件
    └── swan.config.js    // 百度 Swan 小程序构建配置文件
```

### verbose
`boolean` 是否打印详细的构建信息，默认 false，该选项设为 true，等价于 logLevel 设为 `info`

### root
`string` 项目构建的根目录，其它配置指定的路径信息，默认都是相对于该根目录

### designWidth

> 该选项从 `0.4.0` 版本开始支持。

设计稿尺寸，全局配置，如果使用的 [px2rpx](advance/rpx.md) 插件指定了 `designWidth` 则会覆盖该全局配置值。

### framework
`Array.<string>` 扩展的原生小程序的框架，目前只支持 `okam-core` 提供的扩展

* `data`: 支持 `vue` 数据操作方式 及 `computed`
* `model`: 提供 `v-model` 支持 (要求：`okam-build: 0.4.11`, `okam-core: 0.4.8`)
* `vhtml`: 提供 `v-html` 支持 (要求：`okam-build: 0.4.22`)
* `watch`: 提供 `watch` 属性 和 `$watch` API 支持，依赖 `data`
* `broadcast`: 支持广播事件
* `ref`: 允许模板指定 `ref` 属性，组件实例 `$refs` 获取引用，类似 Vue
* `redux`: 使用 `redux` 进行状态管理，要求安装依赖 `redux` 库：`npm i redux --save`, 另外，`redux` 依赖 `data` 扩展，因此需要一起配置
* `behavior`: mixin 支持包括页面组件和自定义组件，对于插件支持选项，可以传入数组形式：`[ ['behavior', '{useNativeBehavior: true}'] ]`，**注意** 第二个参数为插件选项代码的字符串形式
* `filter`: 提供 `filter` 支持，使用示例参考[这里](component/filter)

```javascript
{
    framework: ['data', 'watch', 'model', 'vhtml', 'broadcast', 'ref', 'redux', 'behavior', 'filter']
}
```

### api

> 该选项从 `0.4.0` 版本开始支持。

`Array.<Object>` 可选，要扩展的全局 `API` 定义，可以用来增加特定平台 API 或者重写已有 API，比如用来抹平不同平台 API 差异的实现。定义的 `API` 会挂载到组件、页面、App 实例上下文 `this.$api` 下。

* `key`: 为对应要导出的 api 名称
* `value`: 为对应的该 API 的实现，可以是 NPM 模块，也可以是项目内部实现

```javascript
{
    api: {
        'audio': '@system.audio',
        'hi': './common/api/wx/hi'
    }
}
```

```javascript
// common/api/wx/hi.js
export default function hi() {
    console.log('hi');
}
```

```javascript
// 组件脚本
export default {
    methods: {
        onClick() {
            this.$api.hi(); // 可以在 $api 对象下直接访问到扩展的 API
        }
    }
}
```

**提示** 配置修改，需要重新启动构建，`watch` 模式下不会生效。

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

### resolve

> 该选项从 `0.4.0` 版本开始支持。

`Object` 可选，模块路径 `resolve` 选项

* `resolve.extensions`: `Array.<string>` 查找的模块文件后缀名，会跟默认查找的后缀名做合并
* `resolve.ignore`: `RegExp|Array.<string|RegExp>|(moduleId, appType):Boolean` 要忽略 resolve 的模块 id，可以传入正则，或者数组，也可以是一个 function
* `resolve.onResolve(depModId, file)`: `Function` resolve dep 时候事件监听回调
* `resolve.alias`: 设置引用的模块的别名设置，具体设置同 [webpack.alias](https://webpack.js.org/configuration/resolve/#resolve-alias)，默认 `{'okam$': 'okam-core/src/index'}` `0.4.8 版本开始支持`
* `resolve.modules`: 设置递归查找模块的目录，默认 `node_modules` `0.4.8 版本开始支持`

```javascript
// resolve 配置示例
const notNeedDeclarationAPIFeatures = [
    '@system.router',
    '@system.app'
];

module.exports = {
    // ...
    resolve: {
        ignore: /^@(system|service)\./, // 忽略快应用的内部系统模块的 resolve

        // 模块别名配置
        // import {api} from 'okam';
        // 等价于 import {api} from 'okam-core/src/index';
        // import util form 'common/util';
        // 等价于 import util from 'src/common/util';
        alias: {
            'okam$': 'okam-core/src/index', // 默认构建配置别名设置
            'common/': 'src/common/',
        },

        // 模块查找目录，如果提供的是绝对路径，则不会递归查找，未设置，默认 node_modules
        modules: ['node_modules', path.join(__dirname, '../src/common')],

        /**
         * 收集需要导入声明的 API features
         * 默认不在 `notNeedDeclarationAPIFeatures` 该列表里且
         * `@system.` `@service.`开头的模块
         * 都会自动添加到项目清单的 feature 声明里
         *
         * @param {string} requireModId require 模块 id
         * @param {Object} file require 该模块 id 所属的文件对象
         */
        onResolve(requireModId, file) {
            if (notNeedDeclarationAPIFeatures.indexOf(requireModId) !== -1) {
                return;
            }

            if (/^@(system|service)\./.test(requireModId)) {
                let features = file.features || (file.features = []);
                if (features.indexOf(requireModId) === -1) {
                    features.push(requireModId);
                }
            }
        }
    }
}
```

### script

> 该选项从 `0.4.0` 版本开始支持。

`Object` 可选，执行脚本命令配置，目前提供了两个钩子来执行命令： `onBuildStart` `onBuildDone`

执行脚本命令：`cmd` `args` `options`，具体可以参考 [child_process.spawn](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) API 说明。

```javascript
{
    script: {
        onBuildStart: 'npm run init', // 构建开始要执行的命令
        onBuildStart: { // 也可以是对象形式
            cmd: 'node',
            args: ['init.js'], // 如果提供了 args，cmd 必须是命令名称
            options: {cwd: __dirname} // 选项具体参考
        },
        onBuildStart(opts) { // 可以是 function 形式，返回特定的要执行的脚本命令，
                             // 如果多个，返回数组，如果不需要执行任何命令，可以不返回
            return [
                {
                    cmd: opts.watch ? 'npm run watch' : 'npm run build',
                    options: {cwd: __dirname}
                }
            ];
        }
    }
}
```

### source
`Object` 项目源代码位置信息

* `source.dir`: `string` 项目源代码根目录，默认 `src`
* `source.exclude`: `Array.<string|RegExp>` 要 exclude 的文件
* `source.include`: `Array.<string|RegExp>` 要 include 的文件

!> `okam-build@0.4.9` 开始，`source.include` 支持传入 [glob](https://github.com/isaacs/node-glob) pattern，来额外引入没有被分析到依赖的资源文件，比如字体资源文件，当前没有处理，该文件不局限在 `src` 目录下文件，也可以是 `node_modules` 下文件。**注意**：如果传入的是正则只能匹配根目录下文件（不包括子目录下）或者 `src` 目录下的文件。

```javascript
{
    source: {
        include: [/^src\/common\/font\/.*/, 'node_modules/xx/**/*.png']
    }
}
```

### entry
`Object` 小程序入口配置

* `entry.script`: `string|RegExp` 入口脚本文件
* `entry.style`: `string|RegExp` 入口样式文件
* `projectConfig`: `string|RegExp` 项目配置文件

### output
`Object` 项目构建输出配置信息

* `output.dir`: `string` 输出的目标目录
* `output.depDir`:
    * `string` 输出的 NPM 依赖文件存放的目录，相对于项目根目录，默认 `node_modules` 目录下文件
    * `Object` 配置多个依赖目录存放的目录 `0.4.8 版本开始支持`
* `output.file`: `function(string, Object): boolean|string` 自定义输出文件路径，如果该文件不输出，返回 `false`

```javascript

{
    output: {
        dir: 'dist',
        depDir: {
            node_modules: 'src/dep', // 将依赖文件路径前缀为 `node_modules/` 移到 `src/dep` 下
            bower_components: 'src/dep' // 将依赖文件路径前缀为 `bower_components/` 移到 `src/dep` 下
        },

        /**
         * 自定义输出文件路径。
         * 如果该文件不输出，返回 `false`。
         *
         * @param {string} path 要输出的文件相对路径
         * @param {Object} file 要输出的文件对象
         * @return {boolean|string}
         */
        file(path, file) {
            if (file.isStyle && file.extname !== 'css' && !file.compiled) {
                return false;
            }

            // 不输出未处理的过的文件 和 单文件组件，即 .vue 文件
            if (!file.allowRelease || file.isComponent) {
                return false;
            }

            // 将所有文件的 src 路径前缀去掉
            path = path.replace(/^src\//, '');
            return path;
        }
    }
}

```

### wx2swan
`boolean` 将 微信小程序转成百度小程序，默认为 `false`

* `boolean`, `true` 开启, `false` 不开启，只在构建类型为 `swan` 下有效，目前只是进行基础转换，支持内容[详见 wx2swan](component/transform.md?id=wx2swan)


### component
`Object` 单文件组件的配置

* `component.extname`: `string` 组件的后缀名，默认 `okm`
* `component.template`: `Object` 模板配置项
* `component.template.useVuePrefix`: `boolean` `>= 0.4.6版本支持` 开启使用 `v-` 指令，默认 `false`, 具体使用详见[v- 指令支持](template/vueSyntax.md)
* `component.template.transformTags`: `Object` 模板标签转换配置项，[详见标签转换](build/transformTag)
* `component.global`: `Object` `>=0.4 版本支持` 自定义全局注入的组件，[具体可以参考特定平台代码](advance/platformSpecCode#组件)
* `component.template.modelMap`: `Object` 自定义组件 `v-model` 配置项，[详见自定义配置v-model支持](template/v-model?id=自定义配置支持-v-model)
    * 要求：
        * [framework](build/index?id=framework) 配置了 `'model'` 此项配置才生效
        * 版本: `okam-build >= 0.4.11`
        * 版本: `okam-core >= 0.4.8`
* `component.resourceTags`: `Object` `0.4.12 版本开始支持` 用于依赖资源信息收集的标签定义，默认会尝试从所有 `src` 属性获取本地的资源文件依赖，要求属性值不能使用变量形式，否则不能正确获取对应的依赖信息。

```javascript
{
    component: {
        template: {
            myTag: 'myProp', // 自定义的依赖标签定义，会通过 myTag 的 myProp 获取依赖的资源
            include: true, // 如果设为 true，默认通过 src 属性读取依赖信息
            import: false // 如果设为 false，则不会读取该标签属性定义的依赖信息
        }
    }
}
```


### processors
`Object|Array.<Object>` 自定义的构建处理器，这里定义的处理器，后续的处理规则 `rules` 里，可以直接通过处理器名称 `name` 直接引用，处理器定义包含如下选项，该配置也可以重写 [内建的处理器及插件](build/processors) 选项。

* `name`: `string` 处理器名称，也可以指定内建的处理器名称，用来重写某些配置
* `processor`: `string|Function` 处理器 npm 包名、路径、或者实现（直接 require），也可以直接通过字符串形式引用 `builtin` 处理器，相当于定义了另外一个处理器，该处理器调用内建处理器
* `extnames`: `Array.<string>` 要使用该处理器处理的文件后缀名，`可选`
* `rext`: `string` 处理完输出的文件的后缀名，`可选`
* `deps`: `Array.<string>|string` 声明处理器的 NPM 依赖的包名，`可选`
* `options`: `Object` 处理器处理的默认选项定义，`可选`
* `order`: `number`，当一个文件关联的默认处理器有多个时候，执行顺序，默认 0，值越小，执行优先级越高，`可选`
* `hook`: `Object` 处理器执行的钩子，目前只提供初始化前置钩子，`可选`
    * `hook.before(file, options):void`: 可以通过该钩子，动态修改处理器的选项定义

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
**注意：**匹配是按源文件路径匹配，而非处理器后的路径，如果要匹配单文件组件的 `template`、`script`、`style`， 可以按如下示例判断：（其中，`file.owner`有值，代表该`file`是从单文件组件中派生出来的文件，`owner`值为原单文件组件）

    ```javascript
    // 匹配单文件组件中的模板
    file.isTpl && file.owner

    // 匹配单文件组件中的样式
    file.isStyle && file.owner

    // 匹配单文件组件中的脚本
    file.isScript && file.owner
    ```

* `processors`: `Array.<Object>|Object` 处理的文件要使用的处理器列表, 可以指定预定义的处理器名称，比如 `less`，`stylus`，具体参考[预定义处理器](build/processors)，也可以指定 `预定义处理器` 处理器名称
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

!> 默认情况下，会根据文件的扩展名确定该文件要走什么处理器， 默认处理器即如上`processors`中的第一条处理器`file.processor`，具体可以参考[预定义处理器文件扩展名定义](build/processors)。<br>而且这条规则是排在第一位，无法去掉该默认规则，因此如果你只是想改写某个处理器选项，比如 `stylus`，可以直接在跟 `rules` 平级的 [processors](build/processors) 配置里重写 `stylus` 处理器选项。如果想给 `stylus` 样式文件增加新的处理器比如 `postcss`，可以按如下方式来配置：

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
