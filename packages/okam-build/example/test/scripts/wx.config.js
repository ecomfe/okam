/**
 * @file Build weixin mini program build config
 * @author xxx
 */

'use strict';

const merge = require('../../../').merge;

module.exports = merge({}, require('./base.config'), {
    output: {
        dir: 'wx_dist',
        depDir: 'src/common'
    },

    localPolyfill: [
        'async',
        'promise'
    ],

    dev: {
        processors: {
            postcss: {
                options: {
                    plugins: {
                        'postcss-url': {
                            url: 'inline'
                        }
                    }
                }
            }
        }
    },
    prod: {
        processors: {
            postcss: {
                options: {
                    plugins: {
                        'postcss-url': {
                            url: 'inline'
                        }
                    }
                }
            }
        }
    }
});
