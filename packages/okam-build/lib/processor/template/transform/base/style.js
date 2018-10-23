/**
 * @file transform style
 * @description
 * 仅支持以下语法，不支持styleObject
 * eg
 * 1. :style="{ color: activeColor, fontSize: fontSize + 'px' }"
 * 2. :style="[{ color: activeColor, fontSize: fontSize + 'px' }]"
 *
 * @author sharonzd
 * @date 2018/8/23
 */

'use strict';

const CURLY_BRACE_HAS_REGEXP = require('./constant').CURLY_BRACE_HAS_REGEXP;

module.exports = function (attrs, name, tplOpts) {
    let value = attrs[name];
    if (typeof value === 'string') {
        value = value.trim();
    }
    else {
        value = '';
    }

    if (CURLY_BRACE_HAS_REGEXP.test(value)) {
        value = transformObjStyle(value);
    }
    else {
        value = `{{${value}}}`;
    }

    if (attrs.style) {
        attrs.style = attrs.style + ';' + value;
    }
    else {
        attrs.style = value;
    }

    delete attrs[name];
};

/**
 * transform object syntax class
 * eg: { color: activeColor, fontSize: fontSize + 'px' } -> color: activeColor, font-size: {{fontSize + 'px'}}
 *  [{ color: activeColor,fontWeight: 'bold'}, {fontSize: fontSize + 'px' }] -> color: activeColor, font-size: {{fontSize + 'px'}}
 *
 * @param {string} value   string to be transformed
 * @return {string} transformed result
 */
function transformObjStyle(value) {
    // 去掉首尾空格、去掉首尾方括号、去掉花括号，以`,`为分隔。将字符串重组为style的字面量语法
    value = value
        .trim()
        .replace(/^\[|]$/g, '')
        .replace(/[{}]/g, '')
        .split(',')
        .map(item => {
            const arr = item.split(':');
            arr[0] = arr[0].trim().replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${arr[0]}:{{${arr[1].trim()}}}`;
        }).join(';');
    return value;
}
