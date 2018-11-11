/**
 * @file Transform toutiao condition syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformCondition = require('../base/condition');

const CONDITION_MAP = {
    'if': 'tt:if',
    'elif': 'tt:elif',
    'else-if': 'tt:elif',
    'else': 'tt:else'
};

module.exports = function (attrs, name, tplOpts, opts) {
    transformCondition(attrs, name, tplOpts, Object.assign({
        syntaxMap: CONDITION_MAP,
        wrapCondition: true
    }, opts));
};
