/**
 * @file Transform weixin for key syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformKey = require('../base/key');

module.exports = function (attrs, name, tplOpts, opts) {
    transformKey(attrs, name, tplOpts, Object.assign({
        forItemDirectiveName: 'wx:for-item',
        forKeyDirectiveName: 'wx:key'
    }, opts));
};
