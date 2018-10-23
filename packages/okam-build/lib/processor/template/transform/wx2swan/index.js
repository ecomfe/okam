/**
 * @file weixin mini program syntax tranform to swan
 * @author xiaohong8023@outlook.com
 */

'use strict';

const elementTransformerMap = require('./element');
const attrTransformerMap = require('./attribute');

module.exports = {
    element: elementTransformerMap,
    attribute: attrTransformerMap
};
