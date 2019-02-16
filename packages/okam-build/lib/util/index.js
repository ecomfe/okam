/**
 * @file utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

const helper = require('okam-helper');

function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]';
}

function doMerge(target, source, selector, doNotMergeSelectors) {
    if (doNotMergeSelectors && doNotMergeSelectors.includes(selector)) {
        return source;
    }

    let isTargetArr = Array.isArray(target);
    let isSourceArr = Array.isArray(source);
    if (isTargetArr && isSourceArr) {
        let result = [].concat(target);
        source.forEach(item => {
            if (!result.includes(item)) {
                result.push(item);
            }
        });
        return result;
    }

    let isTargetObj = !isTargetArr && isPlainObject(target);
    let isSourceObj = !isSourceArr && isPlainObject(source);
    if (isTargetObj && isSourceObj) {
        let result = Object.assign({}, target);
        Object.keys(source).forEach(k => {
            if (target.hasOwnProperty(k)) {
                let currSelector = selector ? `${selector}.${k}` : k;
                result[k] = doMerge(
                    target[k], source[k], currSelector, doNotMergeSelectors
                );
            }
            else {
                result[k] = source[k];
            }
        });

        return result;
    }

    return source;
}

/**
 * Merge the given source objects to target object.
 * Notice: it does not support array type data merge.
 *
 * Optional, you can pass property selector array used for controlling property
 * merge behavior. Currently, the given property selector will be override the
 * target object property value instead for merge if both own the property and
 * has the same property value type. This param must be placed for the last
 * position as the last argument.
 *
 * e.g,
 * merge({a: {b: 3, c: 2}}, {a: {b: 2}}) // output: {{a: {b: 2, c: 2}}
 * merge({a: {b: 3, c: 2}}, {a: {b: 2}}, ['a']) // output: {{a: {b: 2}}
 *
 * @param {Object} target the target object to merge
 * @param {...Object} sources the source object
 * @return {Object}
 */
exports.merge = function (target, ...sources) {
    let len = sources.length;
    let lastItem = sources[len - 1];
    let doNotMergeSelectors;
    if (Array.isArray(lastItem)) {
        doNotMergeSelectors = lastItem;
        len = len - 1;
    }

    let result = target;
    for (let i = 0; i < len; i++) {
        let s = sources[i];
        s && (result = doMerge(result, s, '', doNotMergeSelectors));
    }
    return result;
};

exports.toObjectMap = function (arr) {
    return arr.reduce((result, curr) => {
        result[curr] = true;
        return result;
    }, {});
};

/**
 * Remove undefined attributes
 *
 * @param {Object} obj the raw object to process
 * @return {Object}
 */
exports.removeUndefinedAttributes = function (obj) {
    let result = Object.create(null);
    Object.keys(obj).forEach(k => {
        let value = obj[k];
        if (value !== undefined) {
            result[k] = value;
        }
    });
    return result;
};

exports.babel = require('./babel');

Object.assign(exports, helper);
