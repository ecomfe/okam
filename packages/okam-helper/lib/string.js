/**
 * @file String utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * padding the number using leading zero if the bit count of the number is not enough
 * compare to the given bitNum
 *
 * @param  {number|string} value the number to padding
 * @param  {number} bitNum the bit count required to show
 * @return {string}
 */
exports.padZero = function (value, bitNum) {
    let strValue = '' + value;
    let padItems = [];

    let padValue = '0';
    for (let i = 0, len = bitNum - strValue.length; i < len; i++) {
        padItems[padItems.length] = padValue;
    }

    return padItems.join('') + strValue;
};

/**
 * Convert the name to hyphen separated name (kebab-case).
 * E.g., 'Abc' => 'abc', 'MyHome' => 'my-home'
 *
 * @param {string} name the name to be converted
 * @return {string}
 */
exports.toHyphen = function (name) {
    return name.replace(
        /[A-Z]/g,
        (match, key) => (key === 0 ? '' : '-') + match.toLowerCase()
    );
};

/**
 * Convert the kebab-case to CamelCase
 * E.g., 'abc' => 'Abc', 'my-home' => 'MyHome'
 *
 * @param {string} name the name to be converted
 * @return {string}
 */
exports.toCamelCase = function (name) {
    return name.replace(
        /(?:^|\-)(\w)/g,
        (match, c) => c.toUpperCase()
    );
};

/**
 * Format the given tpl using the given data.
 * The tpl variable syntax: ${xxx}
 *
 * @param {string} tpl the tpl to format
 * @param {Object} data the data to apply the tpl
 * @param {boolean} ignoreUndefined whether throw exception when
 *        happen on the undefined tpl variable
 * @return {string}
 */
exports.format = function (tpl, data, ignoreUndefined = false) {
    return tpl.replace(/\${(\w+)}/g, (match, key) => {
        let result = data[key];
        if (result === undefined && !ignoreUndefined) {
            throw key;
        }
        return result;
    });
};

/**
 * Escape the regexp string
 *
 * @param {string} str the regexp string to escape
 * @return {string}
 */
exports.escapeRegExp = function (str) {
    return str.replace(/([\*\.\^\$\?\(\)\+\[\]\{\}\|\\])/g, '\\$1');
};
