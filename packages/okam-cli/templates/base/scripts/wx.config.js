/**
 * @file Build weixin mini program build config
 * @author ${author|raw}
 */

'use strict';

const merge = require('okam-build').merge;

module.exports = merge({}, require('./base.config'), {
    output: {
        dir: 'wx_dist',
        depDir: 'src/common'
    },

    <% if: ${async} %>
    localPolyfill: [
        'async'
    ],
    <% /if %>

    processors: {
        postcss: {
            options: {
                plugins: [
                    ['postcss-url', {
                        url: 'inline'
                    }]
                ]
            }
        },
        <% if: ${script} === 'babel' %>
        filter: {
            options: {
                presets: ['babel-preset-env']
            }
        }
        <% else %>
        filter: {
            options: {
                presets: ['@babel/preset-env']
            }
        }
        <% /if %>
    }
});
