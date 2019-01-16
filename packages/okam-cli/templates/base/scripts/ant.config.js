/**
 * @file Build ant mini program build config
 * @author ${author|raw}
 */

'use strict';

const merge = require('okam-build').merge;

module.exports = merge({}, require('./base.config'), {
    output: {
        dir: 'ant_dist',
        depDir: 'src/common'
    },
    <% if: ${async} %>
    localPolyfill: ['async']
    <% /if %>
});
