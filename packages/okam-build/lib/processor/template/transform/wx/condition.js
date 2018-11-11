/**
 * @file Transform wx condition syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformCondition = require('../base/condition');

const CONDITION_MAP = {
    'if': 'wx:if',
    'elif': 'wx:elif',
    'else-if': 'wx:elif',
    'else': 'wx:else'
};

module.exports = function (attrs, name, tplOpts, opts) {
    transformCondition(attrs, name, tplOpts, Object.assign({
        syntaxMap: CONDITION_MAP,
        wrapCondition: true
    }, opts));
};
