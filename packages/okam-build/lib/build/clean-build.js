/**
 * @file Clean the output files
 * @author sparklewhy@gmail.com
 */

'use strict';

const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');

function normalizePath(value) {
    return value.replace(/\\+/, '/');
}

function normalizeFilter(filter) {
    if (typeof filter === 'string') {
        filter = [filter];
    }

    if (Array.isArray(filter)) {
        return filePath => filter.includes(filePath);
    }

    if (typeof filter === 'function') {
        return filter;
    }

    return () => false;
}

function removeOutputFiles(options) {
    let {outputDir, filter} = options;
    let files;
    try {
        files = fs.readdirSync(outputDir);
    }
    catch (ex) {
        // not existed
        return;
    }

    filter = normalizeFilter(filter);

    for (let i = 0, len = files.length; i < len; i++) {
        let fileName = files[i];
        let fullPath = path.resolve(outputDir, fileName);
        let relativePath = normalizePath(path.relative(outputDir, fullPath));

        if (filter(relativePath)) {
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
