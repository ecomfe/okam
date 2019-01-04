/**
 * @file Build wx mini program config
 * @author xxx
 */

'use strict';

const merge = require('../../../').merge;

module.exports = merge({}, require('./base.config'), {
    output: {
        dir: 'wx_dist',
        // depDir: 'src/common'
    },
    localPolyfill: [
        'async',
        'promise'
    ],
    framework: ['filter'],
    dev: {
        processors: {
            babel7: {
                extnames: 'js'
            },

            postcss: {
                options: {
                    plugins: [
                        ['postcss-url', {
                            url: 'inline'
                        }]
                    ]
                }
            },
            filter: {
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }
    }
});
