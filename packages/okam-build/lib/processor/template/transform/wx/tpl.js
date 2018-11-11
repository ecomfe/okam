/**
 * @file Transform weixin tpl syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformTpl = require('../base/tpl');

module.exports = function (attrs, name, tplOpts, opts) {
    transformTpl(attrs, name, tplOpts, Object.assign({
        transformDataAttr: true
    }, opts));
};
