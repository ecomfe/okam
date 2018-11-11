/**
 * @file Transform toutiao for key syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformKey = require('../base/key');

module.exports = function (attrs, name, tplOpts, opts) {
    transformKey(attrs, name, tplOpts, Object.assign({
        forItemDirectiveName: 'tt:for-item',
        forKeyDirectiveName: 'tt:key'
    }, opts));
};
