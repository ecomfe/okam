/**
 * @file File utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 获取给定的文件路径的状态信息
 *
 * @inner
 * @param {string} target 文件的目标路径
 * @return {?Object}
 */
function getFileState(target) {
    try {
        let state = fs.statSync(target);
        return state;
    }
    catch (ex) {
        // ignore
    }
}

exports.getFileState = getFileState;

/**
 * 判断给定的文件路径是否存在
 *
 * @param {string} target 要判断的目标路径
 * @return {boolean}
 */
exports.isFileExists = function (target) {
    let state = getFileState(target);
    return state && state.isFile();
};

exports.copyFile = function (sourcePath, targetPath) {
    return new Promise((resolve, reject) => {
        let errorHandler = err => reject(err);
        fs.createReadStream(sourcePath).on(
            'error', errorHandler
        ).pipe(
            fs.createWriteStream(targetPath)
        ).on(
            'error', errorHandler
        ).on('close', () => resolve());
    });
};

exports.relative = function (fullPath, rootDir) {
    return path.relative(rootDir, fullPath).replace(/\\/g, '/');
};

exports.getRequirePath = function (file, relativeFile, keepExtnames) {
    let result = exports.relative(file, path.dirname(relativeFile));

    if (keepExtnames !== true) {
        result = result.replace(/\.\w+$/, match => {
            if (keepExtnames && keepExtnames.includes(match)) {
                return match;
            }
            return '';
        });
    }

    if (/^\./.test(result)) {
        return result;
    }
    return './' + result;
};

/**
 * Get the full file path of the given relative file path.
 *
 * @param {string} relativePath the relative file path
 * @param {string} fullPath the full file path of the relative file path relative to
 * @return {string}
 */
exports.getFullPath = function (relativePath, fullPath) {
    let result = path.resolve(path.dirname(fullPath), relativePath);
    return result.replace(/\\/g, '/');
};

/**
 * Get file name without extname info
 *
 * @param {string} filePath the file path
 * @param {boolean=} withExtname wether return the extname info, optional,
 *        by default false
 * @return {string}
 */
exports.getFileName = function (filePath, withExtname = false) {
    let baseName = path.basename(filePath);
    if (withExtname) {
        return baseName;
    }

    let lastDotIdx = baseName.lastIndexOf('.');
    return lastDotIdx === -1
        ? baseName : baseName.substring(0, lastDotIdx);
};

/**
 * Replace file name of the given file path
 *
 * @param {string} filePath the file path to replace
 * @param {string} newFileName the new file name including extname info
 * @return {?string}
 */
exports.replaceFileName = function (filePath, newFileName) {
    if (!newFileName) {
        return;
    }

    let newPath = path.join(path.dirname(filePath), newFileName);
    return newPath.replace(/\\/g, '/');
};

const EXTNAME_REGEXP = /\.\w+$/;

/**
 * Replace file path extname with the new extname
 *
 * @param {string} filePath the file path to replace extname
 * @param {string} newExtname the new extname to replace
 * @return {string}
 */
exports.replaceExtname = function (filePath, newExtname) {
    if (newExtname.charAt(0) !== '.') {
        newExtname = '.' + newExtname;
    }

    return filePath.replace(EXTNAME_REGEXP, newExtname);
};
