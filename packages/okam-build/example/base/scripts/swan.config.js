/**
 * @file Build swan smart program config
 * @author xxx
 */

'use strict';

const merge = require('../../../').merge;
module.exports = merge({}, require('./base.config'), {
    localPolyfill: ['async'],
    wx2swan: true,
    framework: ['filter'],
    processors: {
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
    },
    rules: []
});
