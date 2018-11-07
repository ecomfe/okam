/**
 * @file The base config for building small application
 * @author sparklewhy@gmail.com
 */

'use strict';

module.exports = {

    /**
     * 是否打印详细的构建信息，默认 false，该选项设为 true，等价于 logLevel 设为 `info`
     *
     * @type {boolean}
     */
    verbose: false,

    /**
     * 项目构建的根目录，其它配置指定的路径信息，默认都是相对于该根目录
     *
     * @type {string}
     */
    root: process.cwd(),

    /**
     * 扩展的原生小程序的框架，目前只支持 `okam-core` 提供的扩展：
     * data: 支持 vue 数据操作方式及computed
     * broadcast: 支持广播事件
     * ref 扩展：允许模板指定 ref 属性，组件实例 $refs 获取引用类似 Vue
     * watch: 支持 watch 配置 和 $watch API，依赖 data 扩展需要一起配置
     * redux: 支持 redux 状态管理库，依赖 data 扩展需要一起配置
     * behavior: 支持组件包括 page 的 mixin 支持
     * 可选。e.g., ['data', 'broadcast', 'ref']
     * 对于插件支持选项，可以传入数组形式：
     * [ ['behavior', '{useNativeBehavior: true}'] ]
     * 注意：第二个参数为插件选项代码的字符串形式
     *
     * @type {Array.<string|Array.<string>>}
     */
    framework: null,

    /**
     * 要增加的语法 API polyfill，可选，目前框架默认支持两种:
     * `promise` (依赖 promise-polyfill)
     * `async` (依赖 regenerator-runtime)
     *
     * @type {Array.<string>}
     */
    polyfill: null,

    /**
     * 要增加的语法 API polyfill，通过引入局部变量方式而不是全局对象挂载变量方式引入
     * 优先级高于 `polyfill`，可选，目前框架默认支持两种: `promise`、`async`
     *
     * @type {Array}
     */
    localPolyfill: null,

    /**
     * 项目源代码位置信息
     *
     * @type {Object}
     */
    source: {

        /**
         * 项目源代码根目录
         *
         * @type {string}
         */
        dir: 'src',

        /**
         * 要 exclude 的文件
         *
         * @type {Array.<string|RegExp>}
         */
        exclude: [],

        /**
         * 要 include 的文件
         *
         * @type {Array.<string|RegExp>}
         */
        include: [/^project\.\w+$/]
    },

    /**
     * 小程序入口配置
     *
     * @type {Object}
     */
    entry: {

        /**
         * 入口脚本文件
         *
         * @type {string|RegExp}
         */
        script: /^src\/app\.(js|es|es6|ts)$/,

        /**
         * 入口样式文件
         *
         * @type {string|RegExp}
         */
        style: /^src\/app\.(css|styl|less|sass|scss)$/,

        /**
         * 项目配置文件
         *
         * @type {string|RegExp}
         */
        projectConfig: /^project\.\w+$/
    },

    /**
     * 项目构建输出配置信息
     *
     * @type {Object}
     */
    output: {

        /**
         * 输出的目标目录
         *
         * @type {string}
         */
        dir: 'dist',

        /**
         * 输出的 NPM 依赖文件存放的目录
         *
         * @type {string}
         */
        depDir: 'src/dep',

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

            path = path.replace(/^src\//, '');
            return path;
        }
    },

    /**
     * SFC (Single File Components) 单文件组件的配置
     *
     * @type {Object}
     */
    component: {

        /**
         * 组件的后缀名
         *
         * @type {string}
         */
        extname: 'okm',

        /**
         * 组件内 模板相关配置项
         *
         * @type {Object}
         */
        template: {
            /**
             * 标签转换支持
             * key 小程序标签名
             * value <string|Object|Array>
             * 单个：可为：string Object：类型
             *    取值为 string 时，表示 要被转的标签
             *    取值为 Object 时，Object 的 key 可为：
             *        tag: 表示需转换的 tag, 一般为 HTML tag，
             *        class: 表示 class 需额外附加 class
             *        其他属性: 表示 需替换的属性名
             *
             * eg:
             *
             * navigator {
             *     tag: 'a',
             *     class: 'inline',
             *     href: 'url'
             * }
             *
             * <a class="home-link" href='xxx'></a>
             * 转为:
             * <navigator class="inline" url='xxx'></navigator>
             *
             * 推荐配置：
             *
             * transformTags: {
             *      view: ['div', 'p'],
             *      navigator: {
             *          tag: 'a',
             *          href: 'url'
             *      },
             *      image: 'img'
             * }
             */
            transformTags: null
        }
    },

    /**
     * 是否启用微信组件转换成 swan 组件处理，可选，默认 false
     * 可以传入对象，控制各个部分转换选项
     * {
     *     js: {
     *         plugins: [], // babel plugins using，重写内部使用的 plugins
     *         processor: 'babel' // 使用的 babel 处理器，默认 babel（即 babel6），
     *                            // 如果整个项目转换使用 babel7，这里改成 babel7
     *     },
     *     tpl: {}, // 模板转换选项，具体可以参考模板处理器选项
     *     css: {}, // 样式转换选项，具体可以参考 postcss 处理器选项
     * }
     *
     * @type {boolean|Object}
     */
    wx2swan: false,

    /**
     * 是否启用原生转换处理，可选，默认 true。
     * 当前主要用在 swan 原生支持上适配 okam。
     * 也可以传入配置对象：
     * {
     *     js: {
     *         plugins: [], // babel plugins using，重写内部使用的 plugins
     *         processor: 'babel' // 使用的 babel 处理器，默认 babel（即 babel6），
     *                            // 如果整个项目转换使用 babel7，这里改成 babel7
     *     }
     * }
     *
     * @type {boolean|Object}
     */
    native: true,

    /**
     * 自定义的构建处理器
     *
     * 处理器定义：
     * {
     *     name: 'myProcessor',
     *     processor: 'processorPath', // 可以指定处理器 npm 包名、路径、或者实现（直接 require）
     *     deps: ['xxx'], // 处理器依赖的 NPM 包名，可选
     *     extnames: ['abc'], // 要使用该处理器处理的文件后缀名，可选
     *     rext: 'efg', // 处理完输出的文件的后缀名，可选
     *     options: {}  // 默认的处理器选项，可选
     * }
     *
     * 这里定义的处理器，后续的处理规则 rules 里，可以直接通过处理器名称 `myProcessor` 引用
     *
     * 如果要重写预定义的处理器，比如 less
     * {
     *     name: 'less', // 指定要重写的处理器名
     *     processor: 'xxx' // 重写实现的处理器
     * }
     *
     * 如果要基于现有处理器定义别名处理器：
     * {
     *     name: 'new-processor',
     *     processor: 'less', // 指定现有处理器名
     *     deps: [], // 将同已有处理器 deps 做 merge
     *     options: {} // 覆盖已有处理器的选项信息
     * }
     *
     * 也可以直接传入对象非数组，key 为对应的 processor name:
     * {
     *     less: {
     *         processor: 'xxx',
     *         options: {}
     *     }
     * }
     *
     * @type {Object|Array.<Object>}
     */
    processors: null,

    /**
     * 构建处理规则定义
     *
     * @type {Array.<Object>}
     */
    rules: [
        {

            /**
             * 自定义文件是否要处理，match 也可以传要匹配的文件的 glob pattern 或者 正则
             *
             * e.g.,
             * match: '*.vue'
             * match: /^src\/components\/*.vue/
             *
             * 注意：这里匹配的是处理文件的源路径，不会匹配处理后的路径。比如 less 样式文件处理后
             * 变成 css 样式文件，如果指定 *.css 是没法匹配到的
             *
             * @param {Object} file 要处理的文件
             * @return {boolean}
             */
            match(file) {
                if (file.isStyle && (!file.isEntryStyle && !file.owner)) {
                    // 默认不处理非入口样式及单文件组件的样式文件
                    return false;
                }
                return !!file.processor || file.isComponentConfig;
            },

            /* eslint-disable fecs-valid-jsdoc */
            /**
             * 处理的文件要使用的处理器列表,
             * 可以指定预定义的处理器名称，比如 less，stylus，具体参考 lib/processor/type.js 定义
             *
             * e.g.,
             * processors: ['less']
             * processors: [
             *     { // 自定义处理器选项写法
             *         name: 'less',
             *         options: {}
             *     },
             *     ['less', {}] // 另外一种自定义处理器包含选项写法
             * ]
             * processors: { // 也可以传对象形式
             *     less: {
             *     }
             * }
             *
             * @type {Array|Object}
             */
            processors: [

                /**
                 * 动态确定要使用的处理器，返回默认的处理器名称
                 *
                 * @param {Object} file 要处理的文件
                 * @return {string|Array.<string>}
                 */
                function (file) {
                    return file.isComponentConfig ? 'componentJson' : file.processor;
                }

            ]
        }
    ],

    /**
     * 是否监听文件变化，自动构建，如果对文件变更监听可以直接设置为对象：
     * {
     *      ready() {},
     *      fileChange(filePath) {},
     *      fileAdd(filePath) {},
     *      fileDel(filePath) {},
     *      dirDel(dir) {},
     *      dirAdd(dir) {},
     *      error(err) {}
     * }
     *
     * 注意：开启 watch 功能，需要在命令行提供 `--watch` 选项
     *
     * @type {boolean|Object}
     */
    watch: false,

    /**
     * 自定义的开发 server 配置，可选
     *
     * 注意：开启 server 功能，需要在命令行提供 `--server` 选项，
     * 如果要指定启动端口，可以这里配置也可以命令行指定 `--port 9090`
     * {
     *      // 开发 server 端口，可选，默认 8080
     *      port: 8080,
     *
     *      // server 类型，默认支持：connect/express/koa 实现的 server
     *      // 可选，默认 `connect`，对于使用的 server 类型，需要安装相应的依赖
     *      type: 'connect',
     *
     *      // server 的中间件，可选
     *      // 中间件定义：
     *      // {
     *      //    name: 'xx' // 中间件的 npm 包名
     *      //    options: {} // 创建中间件实例的选项
     *      // }
     *      // or
     *      // ['xxx', {}] // 第一个参数，中间件 npm 包名，第二个为对应的选项
     *      // or
     *      // function () {} // 直接传入对应的中间件函数
     *      middlewares: []
     * }
     *
     * @type {Object}
     */
    server: null,

    /**
     * 附加的开发配置，开发配置使用依赖于环境变量 `NODE_ENV`
     * 配置为 `dev` 或者 `development`
     * 可选。
     *
     * {
     *      // 自定义的处理器，同外层 processors，可选
     *      processors: {},
     *
     *      // 发环境附加的处理规则配置，同外层 rules，可选
     *      rules: [],
     * }
     *
     * @type {Object}
     */
    dev: {}

    /**
     * 附加的环境配置，开发配置使用依赖于环境变量 `NODE_ENV` 值：env，值同 dev
     * 可选。
     *
     * @type {Object}
     */
    // <env>: {},
};
