/**
 * @file Build tt mini program config
 * @author ${author|raw}
 */

'use strict';

const merge = require('okam-build').merge;

module.exports = merge({}, require('./base.config'), {
    output: {
        dir: 'tt_dist',
        depDir: 'src/common'
    },
    <% if: ${async} %>
    localPolyfill: [
        'async'
    ],
    <% /if %>
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
