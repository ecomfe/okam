/**
 * @file transform for circulation
 * @author sharonzd
 * @date 2018/8/7
 */

'use strict';

const {FOR_ITEM_INDEX_REGEXP, BRACKET_REGEXP} = require('./constant');

module.exports = function (attrs, name, tplOpts, opts) {
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

    if (!supportForAbbr) {
        let {forItemDirectiveName, forIndexDirectiveName} = opts;
        let result = FOR_ITEM_INDEX_REGEXP.exec(newValue);
        if (result) {
            let args = result[1];
            let arrVarName = result[2];
            newValue = arrVarName.trim();

            args = args.split(',');
            let itemName = args[0].trim();
            let indexName = args[1];
            attrs[forItemDirectiveName] = itemName;
            indexName && (attrs[forIndexDirectiveName] = indexName.trim());
        }

        if (newValue) {
            newValue = `{{ ${newValue} }}`;
        }
    }

    attrs[newName] = newValue;
};

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
