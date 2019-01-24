/**
 * @file Build wx mini program config
 * @author xxx
 */

'use strict';

const merge = require('../../../../').merge;
module.exports = merge({}, require('./base.config'), {
    output: {
        dir: 'wx_dist',
        depDir: 'src/common'
    },
    processors: {
        babel7: {
            extnames: 'js'
        }
    }
});
