/**
 * @file Transform toutiao tpl syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformTpl = require('../base/tpl');

module.exports = function (element, tplOpts, opts) {
    transformTpl(element, tplOpts, Object.assign({
        transformDataAttr: true
    }, opts));
};
