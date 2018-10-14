/**
 * @file The other misc helper utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

exports.getUserHomeDir = function () {
    const os = require('os');
    return os.homedir();
};

/**
 * Check the given object whether is Promise instance
 *
 * @param {Object} obj the object to check
 * @return {boolean}
 */
exports.isPromise = function (obj) {
    return obj && typeof obj.then === 'function' && typeof obj.catch === 'function';
};

/**
 * Generated the given data md5 digest
 *
 * @param {string|Object} data the data to generate digest
 * @param {string=} encoding the encoding of the given data
 * @return {string}
 */
exports.md5 = function (data, encoding) {
    let crypto = require('crypto');
    let md5 = crypto.createHash('md5');

    if (!encoding) {
        encoding = typeof data === 'string' ? 'utf8' : 'binary';
    }

    md5.update(data, encoding);
    return md5.digest('hex');
};
