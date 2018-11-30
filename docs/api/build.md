# 构建 API

## merge

* 接口说明：用于构建配置的合并

* 接口定义：`merge(target, ...sources): Object`
    * `target`: 要合并的目标对象
    * `...sources`: 要合入的源对象
    * 可选，该接口最后一个参数也可以传入一个字符串数组，来控制 `merge` 的策略

* 默认的 merge 策略：`deep merge`
    * 如果对应的属性值都是数组，则将所有数组项合并，不会对数组项内容进行深度合并，只是做 `concat` 操作和去重处理
    * 如果对应的属性值都是普通对象，则递归做 `deep merge`
    * 如果对应属性值类型不同，或者不同时存在该属性定义，则 source 覆盖 target 属性值。

* 如果指定了最后一个数组参数，则会对于数组里指定的属性选择器路径，做属性值的覆盖操作，而不是 `deep merge` 策略。

下述是一个合并构建配置的例子：

* `base.config.js`

    ```javascript
    module.exports = {
        component: {
            template: {
                transformTags: {
                    'a': 'navigator'
                }
            }
        },

        processors: {
            postcss: {
                options: {
                    plugins: ['autoprefixer', 'px2rpx']
                }
            }
        }
    }
    ```

* `my.config.js`

    ```javascript
    const {merge} = require('okam-build');

    /**
     * 不 merge 属性选择器，即直接覆盖属性值
     *
     * @type {Array.<string>}
     */
    const overridePropertySelectors = [
        'component.template',
        'processors.postcss.options.plugins'
    ];

    const OUTPUT_DIR = 'quick_dist';
    module.exports = merge({}, require('./base.config'), {
        component: {
            template: {
                transformTags: {
                    'view': 'div',
                    'button': 'my-button'
                }
            }
        },

        processors: {
            postcss: {
                options: {
                    plugins: ['autoprefixer', 'px2rpx', 'env']
                }
            }
        }
    }, overridePropertySelectors);
    ```

* merge 后的配置

    ```javascript
    {
        component: {
            template: { // 该属性直接覆盖 base 值
                transformTags: {
                    'view': 'div',
                    'button': 'my-button'
                }
            }
        },

        processors: {
            postcss: {
                options: {
                    plugins: ['px2rpx', 'env'] // 跟 base 值进行了数组 merge
                }
            }
        }
    }
    ```

## reverseTagMap

> 0.4 版本开始支持，为了兼容之前的标签转换配置提供的快速兼容转换 API

* 接口说明：用于构建配置项 [component.template.transformTags](build/transformTag) 的转换

* 接口定义：`reverseTagMap(tagsConf: Object): Object`
    * `tagsConf`: `Object` 需 reverse 的 tags 配置项
    * 返回转换后的标签转换配置

* 使用示例

    ```javascript
    const reverseTagMap = require('okam-build').reverseTagMap;

    module.exports = {
        // ...
        component: {
            template: {
                transformTags: reverseTagMap({
                    // 传入配置 key 为转换后的目标 tag，value 为要转换的源标签信息
                    view: [
                        {
                            tag: 'span',
                            class: 'okam-inline' // 要附加添加的样式信息
                        },
                        'div', 'p',
                        'ul', 'ol', 'li',
                        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'article', 'section', 'aside', 'nav', 'header', 'footer'
                    ],

                    navigator: {
                        tag: 'a',
                        class: 'okam-inline',
                        href: 'url'
                    },

                    image: 'img'
                })
            }
        }
    }
    ```

## run

* 接口说明：用于构建的入口

* 接口定义：`run(appType, options)`
    * @param {string} `appType`: 构建的 `appType`，可选，默认 `swan`，默认会优先从命令行读取 `type` 参数值
    * @param {Object} `options`: 自定义的构建选项，可选，默认读取当运行目录的构建配置：`<cwd>/scripts/<appType>.config.js`，如果读取不到，则使用默认内部配置，此外，也可以使用下面介绍的命令行选项的 `config` 参数指定构建配置的文件
* 示例

    ```javascript
    const {run} = require('okam-build');
    run();
    ```

## 构建命令行选项

* `--config your-app-config.js`: 指定构建配置文件路径

* `--type <appType>`: 指定构建的 `appType`

* `--watch`: 使用 `watch` 模式进行构建

* `--server`: 使用开发 `server`，构建配置里指定 server 配置信息，是无法启动开发 Server，必须命令行参数指定该参数

* `--port <port>`: 使用开发 `server` 监听的端口，未指定会读取环境变量 `PORT` 值，读取不到，默认使用 `8080` 端口

* `--clean`: 清除旧的构建产物，不包括项目配置文件以及快应用的项目基础架子（只清除快应用构建产物的 `src` 目录）
