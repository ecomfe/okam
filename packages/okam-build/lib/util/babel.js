/**
 * @file Bable utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const fs = require('fs');
const json5 = require('json5');
const file = require('okam-helper').file;

/**
 * Read the babel config
 *
 * @param {string} rootDir the project root directory
 * @return {?Object}
 */
exports.readBabelConfig = function (rootDir) {
    let babelRcFile = path.resolve(rootDir, '.babelrc');
    if (file.isFileExists(babelRcFile)) {
        return json5.parse(fs.readFileSync(babelRcFile, 'utf-8'));
    }

    let pkgMetaFile = path.resolve(rootDir, 'package.json');
    if (file.isFileExists(pkgMetaFile)) {
        return require(pkgMetaFile).babel;
    }
};

/**
 * Check the plugins existed the given plugin name
 *
 * @param {string} name the plugin name to check
 * @param {Array} plugins the existed plugin list
 * @return {boolean}
 */
exports.hasPlugin = function (name, plugins) {
    return plugins.some(item => {
        if (Array.isArray(item)) {
            item = item[0];
        }

        if (typeof item === 'string') {
            return name === item;
        }
        return false;
    });
};

