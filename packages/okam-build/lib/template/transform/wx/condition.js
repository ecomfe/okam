/**
 * @file Transform wx condition syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformer = require('../base/condition');

const CONDITION_MAP = {
    'if': 'wx:if',
    'elif': 'wx:elif',
    'else-if': 'wx:elif',
    'else': 'wx:else'
};

module.exports = function (attrs, name, tplOpts) {
    transformer(CONDITION_MAP, attrs, name, tplOpts);

    let newName = CONDITION_MAP[name];
    let value = attrs[newName];
    if (typeof value === 'string' && value) {
        value = `{{${value}}}`;
    }
    attrs[newName] = value;
};
