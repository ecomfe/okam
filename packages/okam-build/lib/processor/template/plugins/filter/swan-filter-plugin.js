/**
 * @file Swan template filter transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const {getFilterTransformer} = require('./filter-helper');

module.exports = getFilterTransformer({
    tag: 'filter',
    srcAttrName: 'src',
    moduleAttrName: 'module'
});
