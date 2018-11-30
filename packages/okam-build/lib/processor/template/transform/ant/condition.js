/**
 * @file Transform ant condition syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformCondition = require('../base/condition');

const CONDITION_MAP = {
    'if': 'a:if',
    'elif': 'a:elif',
    'else-if': 'a:elif',
    'else': 'a:else'
};

module.exports = function (attrs, name, tplOpts, opts) {
    transformCondition(attrs, name, tplOpts, Object.assign({
        syntaxMap: CONDITION_MAP,
        wrapCondition: true
    }, opts));
};
