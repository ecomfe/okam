/**
 * @file Transform swan condition syntax
 * if   -> s-if
 * elif -> s-elif
 * else-if  ->  s-elif
 * else -> s-else
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformer = require('../base/condition');

const CONDITION_MAP = {
    'if': 's-if',
    'elif': 's-elif',
    'else-if': 's-elif',
    'else': 's-else'
};

module.exports = transformer.bind(this, CONDITION_MAP);
