/**
 * @file Transform swan for syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformFor = require('../base/for');

module.exports = function (attrs, name, tplOpts, opts, element) {
    transformFor(attrs, name, tplOpts, Object.assign({
        forDirectionName: 's-for',
        supportForAbbr: true,
        tripleBrace: true
    }, opts), element);
};
