/**
 * @file transform style
 * @description
 * 仅支持以下语法，不支持styleObject
 * eg
 * 1. :style="{ color: activeColor, fontSize: fontSize + 'px' }"
 * 2. :style="[{ color: activeColor, fontSize: fontSize + 'px' }]"
 * 3. :style="{width, height}"
 *
 * @author sharonzd
 * @date 2018/8/23
 */

'use strict';

const {transformFilterSyntaxValue} = require('./filter');
const {CURLY_BRACE_HAS_REGEXP} = require('./constant');
const {parseBindingStyleValue} = require('../helper/style');

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
        value = transformObjStyle(value);
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
 * @return {string} transformed result
 */
function transformObjStyle(value) {
    return parseBindingStyleValue(value).join(';');
}
