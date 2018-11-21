/**
 * @file Transform quick app for syntax
 * @author sparklewhy@gmail.com
 */

'use strict';

const {transformNumberToArray, transformOfToIn} = require('../base/for');
const {BRACKET_REGEXP, FOR_ITEM_INDEX_REGEXP} = require('../base/constant');

module.exports = function (attrs, name, tplOpts, opts, element) {
    let newValue = attrs[name];

    newValue = transformNumberToArray(newValue);
    newValue = transformOfToIn(newValue);
    newValue = newValue.trim();

    let result = FOR_ITEM_INDEX_REGEXP.exec(newValue);
    if (result) {
        let args = result[1];
        let arrVarName = result[2];

        args = args.split(',');

        let itemName = args[0].replace(BRACKET_REGEXP, '').trim();
        element.forItemName = itemName;
        if (args.length === 2) {
            let indexName = args[1].replace(BRACKET_REGEXP, '').trim();
            newValue = `(${indexName}, ${itemName}) in ${arrVarName}`;
        }
    }

    attrs[name] = newValue;
};
