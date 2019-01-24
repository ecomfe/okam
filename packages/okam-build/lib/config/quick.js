/**
 * @file The config for building quick app
 * @author sparklewhy@gmail.com
 */

'use strict';

const merge = require('../util').merge;
const baseConf = require('./base');

const notNeedDeclarationAPIFeatures = [
    '@system.router',
    '@system.app'
];

module.exports = merge({}, baseConf, {

    /**
     * 模块 resolve 选项
     *
     * @type {Object}
     */
    resolve: {
        ignore: /^@(system|service)\./, // 忽略快应用的内部系统模块的 resolve

        /**
         * 增加 resolve 查找的后缀名
         *
         * @type {Array.<string>}
         */
        extensions: ['ux'],

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
    },

    output: {

        /**
         * 输出的文件路径映射定义
         *
         * @type {Object}
         */
        pathMap: {
            projectConfig: false,
            entryScript: 'app.ux',
            entryStyle: 'app.css',
            appConfig: 'manifest.json'
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

            // do not output not processed file and component config file
            if (!file.allowRelease) {
                return false;
            }

            return path;
        },

        /**
         * None app base class is needed
         */
        appBaseClass: null
    },

    component: {
        template: {
            resourceTags: {
                // 由于快应用不支持模板导入功能，页面组件路径可能会因为同一目录下存在
                // 多个页面组件，而自动调整页面路径，为了避免 include/import 路径
                // 重新计算找不到导入/引用的模板，这里不分析这两个标签定义的依赖资源
                'include': false,
                'import': false
            },

            transformTags: {
                'button': 'o-button'
            }
        },
        global: {
            'o-button': 'okam/button/index'
        }
    },

    processors: {

        // okam component parser
        component: {
            rext: 'ux',
            options: {
                parse: {pad: 'space'},
                trim: true
            }
        },

        // native quick component parser
        quickComponent: {
            rext: 'ux',
            options: {
                parse: {pad: 'space'},
                trim: true
            }
        },

        postcss: {
            extnames: ['css']
        }
    },

    rules: [
        {
            match(file) {
                return file.isAppConfig;
            },
            processors: ['quickAppJson']
        },
        {
            match(file) {
                return file.isEntryScript || file.isComponent || file.isNativeComponent;
            },
            processors: ['quickComponentGenerator']
        },
        {
            match(file) {
                // process sfc component style
                return file.isStyle && file.owner && file.owner.isPageComponent;
            },
            processors: ['addCssDependencies']
        }
    ]
});
