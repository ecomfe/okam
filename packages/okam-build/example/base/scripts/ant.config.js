/**
 * @file Build wx mini program config
 * @author xxx
 */

'use strict';

const merge = require('../../../').merge;

module.exports = merge({}, require('./base.config'), {
    output: {
        dir: 'ant_dist'
    },
    localPolyfill: [
        'async'
        // 'promise'
    ],

    framework: ['filter'],
    processors: {
        babel7: {
            extnames: 'js'
            // options: {
            //     presets: ['@babel/preset-env']
            // }
        }
    },

    api: {
        htmlToNodes: 'mini-html-parser2'
    },

    dev: {
        // processors: {
        //     postcss: {
        //         options: {
        //             plugins: {
        //                 'postcss-url': {
        //                     url: 'inline'
        //                 }
        //             }
        //         }
        //     }
        // }
    }
});
