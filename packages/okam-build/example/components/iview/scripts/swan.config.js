/**
 * @file Build swan smart program config
 * @author xxx
 */

'use strict';

const merge = require('../../../../').merge;
module.exports = merge({}, require('./base.config'), {
    wx2swan: true,

    processors: {
        babel7: {
            extnames: 'js'
        }
    }
});
