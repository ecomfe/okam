/**
 * @file transform for circulation
 * @author sharonzd
 */

'use strict';

const {PLAIN_OBJECT_REGEXP, FOR_ITEM_INDEX_REGEXP, BRACKET_REGEXP} = require('./constant');

/**
 * 转化数字为数组，以支持for="item in 5"语法
 *
 * @param {string} newValue 待转化的字符串
 * @return {string} 被转化后的数组字符串
 */
function transformNumberToArray(newValue) {
    newValue = newValue.trim();
    const wordArray = newValue.split(' ');
    const number = wordArray[wordArray.length - 1];
    const arr = [];

    if (/^\d+$/.test(number)) {
        for (let i = 1; i < +number + 1; i++) {
            arr.push(i);
        }
        newValue = newValue.replace(number, `[${arr}]`);
    }

    return newValue;
}

/**
 * transform 'of' to 'in'， 以支持for="item of items"语法
 *
 * @param {string} newValue 待转化的字符串
 * @return {string} 被转化后的数组字符串
 */
function transformOfToIn(newValue) {
    const wordArray = newValue.trim().split(' ');
    const index = wordArray.indexOf('of');
    if (index !== -1 && !wordArray.includes('in')) {
        wordArray[index] = 'in';
        newValue = wordArray.join(' ');
    }
    return newValue;
}

function normalizeForItemIndex({itemName, indexName, value, attrs, opts}) {
    let {forItemDirectiveName, forIndexDirectiveName, tripleBrace} = opts;
    attrs[forItemDirectiveName] = itemName;
    indexName && (attrs[forIndexDirectiveName] = indexName.trim());

    if (PLAIN_OBJECT_REGEXP.test(value)) {
        if (tripleBrace) {
            value = `{{ ${value} }}`;
        }
        else {
            value = `{${value}}`;
        }
    }
    else {
        value = `{{${value}}}`;
    }

    return value;
}

module.exports = exports = function (attrs, name, tplOpts, opts, element) {
    let {logger, file} = tplOpts;
    let {forDirectionName, supportForAbbr = false} = opts;
    let newName = forDirectionName;
    let newValue = attrs[name].replace(BRACKET_REGEXP, '');

    newValue = transformNumberToArray(newValue);
    newValue = transformOfToIn(newValue);
    newValue = newValue.trim();

    if (attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }
    delete attrs[name];

    let result = FOR_ITEM_INDEX_REGEXP.exec(newValue);
    if (result) {
        let args = result[1];
        let arrVarName = result[2];
        args = args.split(',');

        let itemName = args[0].trim();
        element.forItemName = itemName;

        if (!supportForAbbr) {
            newValue = normalizeForItemIndex({
                itemName,
                indexName: args[1],
                attrs,
                value: arrVarName.trim(),
                opts
            });
        }
    }
    else if (!supportForAbbr) { // fallback to support wx native syntax
        newValue = `{{${newValue}}}`;
    }

    attrs[newName] = newValue;
};

exports.transformNumberToArray = transformNumberToArray;
exports.transformOfToIn = transformOfToIn;
