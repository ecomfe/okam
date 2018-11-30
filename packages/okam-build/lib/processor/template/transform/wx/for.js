/**
 * @file Transform wx for syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformFor = require('../base/for');

module.exports = function (attrs, name, tplOpts, opts, element) {
    transformFor(attrs, name, tplOpts, Object.assign({
        forDirectionName: 'wx:for',
        forItemDirectiveName: 'wx:for-item',
        forIndexDirectiveName: 'wx:for-index',
        tripleBrace: true
    }, opts), element);
};
