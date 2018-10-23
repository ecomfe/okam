/**
 * @file The config for building weixin mini program
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
            entryStyle: 'app.wxss',
            appConfig: 'app.json'
        },

        /**
         * 输出的自定义组件各个部分文件的后缀名
         *
         * @type {Object}
         */
        componentPartExtname: {
            script: 'js',
            style: 'wxss',
            tpl: 'wxml',
            config: 'json'
        }
    },

    processors: {
        cssImport: {
            processor: 'postcss', // using the existed postcss processor
            extnames: ['wxss'],
            rext: 'wxss',
            options: {
                plugins: ['cssImport']
            }
        }
    }
});
