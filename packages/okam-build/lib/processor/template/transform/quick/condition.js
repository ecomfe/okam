/**
 * @file Transform quickApp condition syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformCondition = require('../base/condition');

const CONDITION_MAP = {
    'else-if': 'elif'
};

module.exports = function (attrs, name, tplOpts, opts) {
    transformCondition(attrs, name, tplOpts, Object.assign({
        syntaxMap: CONDITION_MAP,
        wrapCondition: true
    }, opts));
};
