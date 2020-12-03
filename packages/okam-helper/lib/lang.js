/**
 * @file Lang utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

const toString = Object.prototype.toString;

/**
 * Check the given object whether is Promise instance
 *
 * @param {Object} obj the object to check
 * @return {boolean}
 */
exports.isPromise = function (obj) {
    return obj && typeof obj.then === 'function' && typeof obj.catch === 'function';
};


exports.isPlainObject = function (obj) {
    return toString.call(obj) === '[object Object]';
};
