/**
 * @file Weixin template filter transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const {getFilterTransformer} = require('./filter-helper');

module.exports = getFilterTransformer({
    tag: 'wxs',
    srcAttrName: 'src',
    moduleAttrName: 'module'
});
