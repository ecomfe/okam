/**
 * @file The config for building h5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

const merge = require('../util').merge;
const baseConf = require('./base');

module.exports = merge({}, baseConf, {

    output: {

        /**
         * 输出的文件路径映射定义
         *
         * @type {Object}
         */
        pathMap: {
            projectConfig: false,
            entryScript: 'main.js',
            entryStyle: false,
            appConfig: false
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
                // 由于 Vue 不支持模板导入功能，页面组件路径可能会因为同一目录下存在
                // 多个页面组件，而自动调整页面路径，为了避免 include/import 路径
                // 重新计算找不到导入/引用的模板，这里不分析这两个标签定义的依赖资源
                include: false,
                import: false
            }
        }
    },

    processors: {
        postcss: {
            extnames: ['css']
        }
    },

    rules: [

    ]
});
