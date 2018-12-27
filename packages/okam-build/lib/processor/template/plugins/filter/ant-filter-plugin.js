/**
 * @file Ant template filter transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const {getFilterTransformer} = require('./filter-helper');

module.exports = getFilterTransformer({
    tag: 'import-sjs',
    srcAttrName: 'from',
    moduleAttrName: 'name'
});
