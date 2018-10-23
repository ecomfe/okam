/**
 * @file transform for circulation
 * @author sharonzd
 * @date 2018/8/7
 */

'use strict';

const BRACKET_REGEXP = require('./constant').BRACKET_REGEXP;

module.exports = function (forDirectionName, attrs, name, tplOpts) {
    let {logger, file} = tplOpts;
    let newName = forDirectionName;
    let newValue = attrs[name].replace(BRACKET_REGEXP, '');

    newValue = transformNumberToArray(newValue);
    newValue = transformOfToIn(newValue);

    if (attrs.hasOwnProperty(newName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${newName}`);
    }
    delete attrs[name];

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
