/**
 * @file Clean the output files
 * @author sparklewhy@gmail.com
 */

'use strict';

const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');

function normalizeOnePath(value) {
    return value.replace(/\\+/, '/');
}

function normalizeFilePaths(filePaths) {
    if (Array.isArray(filePaths)) {
        return filePaths.map(item => normalizeOnePath(item));
    }
}

function removeOutputFiles(options) {
    let {outputDir, keepFilePaths} = options;
    let files;
    try {
        files = fs.readdirSync(outputDir);
    }
    catch (ex) {
        // not existed
        return;
    }

    keepFilePaths = normalizeFilePaths(keepFilePaths) || [];

    for (let i = 0, len = files.length; i < len; i++) {
        let fileName = files[i];
        let fullPath = path.resolve(outputDir, fileName);
        let relativePath = normalizeOnePath(path.relative(outputDir, fullPath));

        if (keepFilePaths.includes(relativePath)) {
            continue;
        }

        let state = fs.statSync(fullPath);
        if (!state) {
            return;
        }

        rimraf.sync(fullPath);
    }
}


module.exports = exports = removeOutputFiles;
