/**
 * @file transform class
 * @description
 * eg
 * 1. :class={ active: isActive }   ->    class={{[isActive ? 'active' : '']}}
 * 2. class="static" :class="{ active: isActive, 'text-danger': hasError }"  ->  class="static {{[isActive ? 'active' : '', hasError ? 'text-danger' : '']}}"
 * 3. class="static" :class="[activeClass, errorClass]" -> class="static {{[activeClass, errorClass]}}
 * 4. class="static" :class="[isActive ? activeClass : '', errorClass]"  ->  class="static {{[isActive ? activeClass : '', errorClass]}}"
 * 5. class="static" :class="[{ active: isActive }, errorClass]" -> class="static {{[isActive ? 'active' : '', errorClass]}}
 *
 * @author sharonzd
 * @date 2018/8/15
 */

'use strict';

const {PLAIN_OBJECT_REGEXP, SQUARE_BRACKETS_REGEXP} = require('./constant');

module.exports = function (attrs, name, tplOpts, arrToStr = false) {
    let value = attrs[name];
    if (typeof value === 'string') {
        value = value.trim();
    }
    else {
        value = '';
    }

    if (PLAIN_OBJECT_REGEXP.test(value)) {
        value = '[' + transformObjClass(value) + ']';
        arrToStr && (value += '.join(\' \')');
    }
    else if (SQUARE_BRACKETS_REGEXP.test(value)) {
        value = transformArrayClass(value);
        arrToStr && (value += '.join(\' \')');
    }

    value = `{{${value}}}`;

    // add up static class and dynamic class when there is class attribute
    attrs.class = attrs.hasOwnProperty('class') ? `${attrs.class} ${value}` : value;

    delete attrs[name];
};

/**
 * transform object syntax class
 * eg: { active: isActive } -> [isActive ? 'active' : '']
 *
 * @param {string} value   string to be transformed
 * @param {boolean=} wrapArr whether using array syntax wrap, by default false
 * @return {string} transformed result
 */
function transformObjClass(value, wrapArr = false) {
    value = value.replace(/[\s*{}]/g, '').split(',').map(item => {
        const arr = item.split(':');
        if (!arr[0].includes('\'')) {
            arr[0] = `'${arr[0]}'`;
        }
        return `${arr[1]}?${arr[0]}:''`;
    });
    return wrapArr ? `[${value}]` : value;
}

/**
 * transform array syntax class
 * eg: [{ active: isActive }, errorClass] -> [[isActive ? 'active' : ''], errorClass]
 *
 * @param {string} value   string to be transformed
 * @return {string} transformed result
 */
function transformArrayClass(value) {
    value = value.replace(/[\s*[\]]/g, '').split(',').map(item => {
        if (/^{.*}$/.test(item)) {
            return transformObjClass(item);
        }
        return item;
    });
    return `[${value}]`;
}
