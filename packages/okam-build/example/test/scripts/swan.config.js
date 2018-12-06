/**
 * @file Build swan smart program build config
 * @author xxx
 */

'use strict';

const merge = require('../../../').merge;

module.exports = merge({}, require('./base.config'), {
    polyfill: ['async'],
    // wx2swan: true,
    rules: []
});
