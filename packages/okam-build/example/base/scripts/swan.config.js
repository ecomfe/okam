/**
 * @file Build swan smart program config
 * @author xxx
 */

'use strict';

module.exports = Object.assign({}, require('./base.config'), {
    polyfill: ['async'],
    processors: {
        wx2swan: {
            // 注册 及 配置 wxml、wxss 文件转换
            extnames: ['wxml', 'wxss']
        }
        // vant: {
        //     processor: 'babel',
        //     options: {
        //         plugins: [
        //             require('okam-plugin-vant').babel
        //         ]
        //     }
        // },
        // babel: {
        //     options: {
        //         plugins(file) {
        //             if (file.path.indexOf('node_modules/vant-weapp/dist/') === 0) {
        //                 return [
        //                     require('okam-plugin-vant').babel
        //                 ];
        //             }
        //         }
        //     }
        // }
        // wxml2swan: {
        //     processor: 'view',
        //     options: {
        //         plugins: [
        //             {
        //                 tag() {
        //                 }
        //             }
        //         ]
        //     },
        //     extnames: 'wxml'
        // }
    },
    rules: [
        {
            // 配置 js 文件转换
            match(file) {
                return file.isNpmWxCompScript;
            },
            processors: ['wx2swan']
        }
    ]
});
