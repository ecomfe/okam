/**
 * @file The language utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

const toString = Object.prototype.toString;

/**
 * Check the given value whether is plain object type
 *
 * @param {*} obj the value to check
 * @return {boolean}
 */
export function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]';
}

export function isSimpleType(value) {
    let type = typeof value;
    return type === 'string' || type === 'number' || type === 'boolean';
}

