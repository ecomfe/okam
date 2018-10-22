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

exports.getRequirePath = function (file, relativeFile) {
    let result = exports.relative(file, path.dirname(relativeFile));
    result = result.replace(/\.js$/, '');
    if (/^\./.test(result)) {
        return result;
    }
    return './' + result;
};


/**
 * Get file name
 *
 * @param {string} filePath the file path
 * @return {string}
 */
exports.getFileName = function (filePath) {
    let baseName = path.basename(filePath);
    let lastDotIdx = baseName.lastIndexOf('.');
    return lastDotIdx === -1
        ? baseName : baseName.substring(0, lastDotIdx);
};
