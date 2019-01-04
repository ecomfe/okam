/**
 * @file Transform wx data binding
 *      :attr="value" -> attr="{{value}}"
 *      :attr="{a: 3, b: c}" -> attr="{{ {a: 3, b: c} }}"
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformDataBind = require('../base/data-bind');

module.exports = function (attrs, name, tplOpts, opts, element) {
    transformDataBind(attrs, name, tplOpts, Object.assign({
        tripleBrace: true
    }, opts), element);
};
