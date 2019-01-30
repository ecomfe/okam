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

const {transformFilterSyntaxValue} = require('./filter');
const {CURLY_BRACE_HAS_REGEXP} = require('./constant');

module.exports = function (attrs, name, tplOpts, opts, element) {
    let value = attrs[name];
    if (typeof value === 'string') {
        value = value.trim();
    }
    else {
        value = '';
    }

    let {config, logger} = tplOpts;
    let wrapCurlyBrace = false;
    if (CURLY_BRACE_HAS_REGEXP.test(value)) {
        value = transformObjStyle(value, logger);
    }
    else {
        wrapCurlyBrace = true;
    }

    let newValue = transformFilterSyntaxValue(
        element, {name: 'style', value}, config, logger
    );
    value = wrapCurlyBrace ? `{{${newValue}}}` : newValue;

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
 * @param {Object} logger the logger util
 * @return {string} transformed result
 */
function transformObjStyle(value, logger) {
    // 去掉首尾空格、去掉首尾方括号、去掉花括号，以`,`为分隔。将字符串重组为style的字面量语法
    let stylePropValues = value
        .trim()
        .replace(/^\[|]$/g, '')
        .replace(/[{}]/g, '')
        .split(',');

    let result = [];
    stylePropValues.forEach(item => {
        let colonIdx = item.indexOf(':');
        if (colonIdx === -1) {
            logger.error(
                'invalidated template style binding value',
                `\`${item}\``,
                `in ${value}`
            );
        }
        else {
            let propName = item.substring(0, colonIdx)
                .trim().replace(/([A-Z])/g, '-$1').toLowerCase();
            let propValue = item.substr(colonIdx + 1).trim();
            result.push(`${propName}:{{${propValue}}}`);
        }
    });

    return result.join(';');
}
