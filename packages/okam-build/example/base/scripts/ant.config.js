/**
 * @file Build wx mini program config
 * @author xxx
 */

'use strict';

const merge = require('../../../').merge;

module.exports = merge({}, require('./base.config'), {
    output: {
        dir: 'ant_dist',
        depDir: 'src/common'
    },
    localPolyfill: [
        'async',
        'promise'
    ],

    processors: {
        babel7: {
            extnames: 'js',
            options: {
                presets: ['@babel/preset-env']
            }
        }
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
