/**
 * @file Template syntax transformer
 * @author sparklewhy@gmail.com
 */

'use strict';

const elementTransformerMap = require('./element');
const attrTransformerMap = require('./attribute');

module.exports = {
    element: elementTransformerMap,
    attribute: attrTransformerMap
};
