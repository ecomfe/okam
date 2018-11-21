/**
 * @file Transform weixin for key syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformKey = require('../base/key');

module.exports = function (attrs, name, tplOpts, opts, element) {
    transformKey(attrs, name, tplOpts, Object.assign({
        forKeyDirectiveName: 'wx:key'
    }, opts), element);
};
