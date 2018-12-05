/**
 * @file Transform toutiao for syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformFor = require('../base/for');

module.exports = function (attrs, name, tplOpts, opts, element) {
    transformFor(attrs, name, tplOpts, Object.assign({
        forDirectionName: 'tt:for',
        forItemDirectiveName: 'tt:for-item',
        forIndexDirectiveName: 'tt:for-index',
        tripleBrace: true
    }, opts), element);
};
