/**
 * @file The config for building toutiao mini program
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
            projectConfig: 'project.config.json',
            entryScript: 'app.js',
            entryStyle: 'app.ttss',
            appConfig: 'app.json'
        },

        /**
         * 输出的自定义组件各个部分文件的后缀名
         *
         * @type {Object}
         */
        componentPartExtname: {
            script: 'js',
            style: 'ttss',
            tpl: 'ttml',
            config: 'json'
        }
    },

    processors: {
        postcss: {
            extnames: ['ttss', 'css']
        },
        nativeView: {
            processor: 'view',
            extnames: ['ttml'],
            options: {
                keepOriginalContent: true,
                plugins: [['resource', {
                    tags: {
                        'import': true,
                        'include': true
                    }
                }]]
            }
        }
    }
});
