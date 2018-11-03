/**
 * @file Transform ant for syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const transformer = require('../base/for');
const FOR_DIRECTIVE = 'a:for';
const FOR_INDEX_DIRECTIVE = 'a:for-index';
const FOR_ITEM_DIRECTIVE = 'a:for-item';
const FOR_ITEM_INDEX_REGEXP = /^(.+)\s+in\s+(.+)$/;

module.exports = function (attrs, name, tplOpts) {
    transformer(FOR_DIRECTIVE, attrs, name, tplOpts);

    let value = attrs[FOR_DIRECTIVE].trim();
    let result = FOR_ITEM_INDEX_REGEXP.exec(value);
    if (result) {
        let args = result[1];
        let arrVarName = result[2];
        value = attrs[FOR_DIRECTIVE] = arrVarName.trim();

        args = args.split(',');
        let itemName = args[0].trim();
        let indexName = args[1];
        attrs[FOR_ITEM_DIRECTIVE] = itemName;
        indexName && (attrs[FOR_INDEX_DIRECTIVE] = indexName.trim());
    }

    if (typeof value === 'string' && value) {
        value = `{{ ${value} }}`;
    }
    attrs[FOR_DIRECTIVE] = value;
};

