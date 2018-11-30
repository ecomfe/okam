/**
 * @file Transform swan condition syntax
 * if   -> s-if
 * elif -> s-elif
 * else-if  ->  s-elif
 * else -> s-else
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformCondition = require('../base/condition');

const CONDITION_MAP = {
    'if': 's-if',
    'elif': 's-elif',
    'else-if': 's-elif',
    'else': 's-else'
};

module.exports = function (attrs, name, tplOpts, opts) {
    transformCondition(attrs, name, tplOpts, Object.assign({
        syntaxMap: CONDITION_MAP
    }, opts));
};
