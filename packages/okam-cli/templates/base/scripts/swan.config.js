/**
 * @file Build swan smart program build config
 * @author ${author|raw}
 */

'use strict';

const merge = require('okam-build').merge;

module.exports = merge({}, require('./base.config'), {
    <% if: ${async} %>
    polyfill: ['async'],
    <% /if %>
    // wx2swan: true,
    rules: []
});
