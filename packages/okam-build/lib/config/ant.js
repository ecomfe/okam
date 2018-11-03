/**
 * @file The config for building ali ant mini program
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
            entryScript: 'app.js',
            entryStyle: 'app.acss',
            appConfig: 'app.json'
        },

        /**
         * 输出的自定义组件各个部分文件的后缀名
         *
         * @type {Object}
         */
        componentPartExtname: {
            script: 'js',
            style: 'acss',
            tpl: 'axml',
            config: 'json'
        }
    },

    processors: {
        cssImport: {
            processor: 'postcss', // using the existed postcss processor
            extnames: ['acss'],
            rext: 'acss',
            options: {
                plugins: ['cssImport']
            }
        }
    }
});
