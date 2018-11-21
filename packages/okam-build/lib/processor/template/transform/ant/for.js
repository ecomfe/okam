/**
 * @file Transform ant for syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformFor = require('../base/for');

module.exports = function (attrs, name, tplOpts, opts, element) {
    transformFor(attrs, name, tplOpts, Object.assign({
        forDirectionName: 'a:for',
        forItemDirectiveName: 'a:for-item',
        forIndexDirectiveName: 'a:for-index'
    }, opts), element);
};
