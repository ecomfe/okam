/**
 * @file utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

const helper = require('okam-helper');

function doMerge(target, source) {
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

    let isTargetObj = !isTargetArr && target && typeof target === 'object';
    let isSourceObj = !isSourceArr && source && typeof source === 'object';
    if (isTargetObj && isSourceObj) {
        let result = Object.assign({}, target);
        Object.keys(source).forEach(k => {
            if (target.hasOwnProperty(k)) {
                result[k] = doMerge(target[k], source[k]);
            }
            else {
                result[k] = source[k];
            }
        });

        return result;
    }

    return source;
}

exports.merge = function (target, ...sources) {
    let result = target;
    for (let i = 0, len = sources.length; i < len; i++) {
        let s = sources[i];
        s && (result = doMerge(result, s));
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
