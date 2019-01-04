/**
 * @file load the files to be processed
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const fs = require('fs');
const MM = require('minimatch').Minimatch;
const {getFileState, relative} = require('../util').file;
const FileFactory = require('../processor/FileFactory');

function traverseFiles(rootDir, filter) {
    let toProcessDirs = [rootDir];
    while (toProcessDirs.length) {
        let currDir = toProcessDirs.pop();
        let files = fs.readdirSync(currDir);
        for (let i = 0, len = files.length; i < len; i++) {
            let fileName = files[i];
            if (/^\./.test(fileName)) {
                continue;
            }

            let fullPath = path.resolve(currDir, fileName);
            let relativePath = relative(fullPath, rootDir);
            let stat = getFileState(fullPath);
            if (!stat) {
                continue;
            }

            let isDir = stat.isDirectory();
            if (filter(relativePath, isDir, fullPath)) {
                continue;
            }

            if (isDir) {
                toProcessDirs.push(fullPath);
            }
        }
    }
}

function addFileRule(allRules, rule) {
    if (typeof rule === 'string') {
        let m = new MM(rule, {matchBase: true});
        allRules.push(m);
    }
    else if (rule instanceof RegExp) {
        allRules.push({match: str => rule.test(str)});
    }
}

function resolvePath(file, rootDir) {
    if (typeof file === 'string') {
        return relative(path.resolve(rootDir, file), rootDir);
    }
    return file;
}

function loadProcessFiles(options, logger) {
    let rootDir = options.root;
    let {dir, exclude, include} = options.source;
    if (!dir) {
        logger.error('missing the source dir config information');
        return;
    }

    let initBuildFiles = [];
    let componentExtname = options.component.extname;
    let {style: entryStyle, script: entryScript, projectConfig} = options.entry;
    entryStyle = resolvePath(entryStyle, rootDir);
    entryScript = resolvePath(entryScript, rootDir);
    projectConfig = resolvePath(projectConfig, rootDir);

    let sourceDir = resolvePath(dir, rootDir);
    let excludeRules = [];
    exclude && exclude.forEach(addFileRule.bind(this, excludeRules));
    excludeRules.length || (excludeRules = null);

    let sourcePathPrefix = `${sourceDir}/`;
    let customIncludeRules = [];
    include && include.forEach(addFileRule.bind(this, customIncludeRules));

    let processFiles = new FileFactory({
        root: rootDir,
        rebaseDepDir: (options.output || {}).depDir,
        entryStyle,
        entryScript,
        projectConfig,
        componentExtname
    });
    let filterFiles = function (file, isDir, fullPath) {
        if (isDir && file === sourceDir) {
            return false;
        }

        let isFilter = excludeRules && excludeRules.some(item => item.match(file));
        if (isFilter) {
            return true;
        }

        let isCustomInclude = customIncludeRules.some(item => item.match(file));
        if (!isCustomInclude && file.indexOf(sourcePathPrefix) !== 0) {
            return true;
        }

        if (isDir) {
            return false;
        }

        let toProcessFile = processFiles.createFile({
            path: file,
            fullPath
        });

        // ensure the entry app script can be compiled at first
        if (toProcessFile.isEntryScript
            || toProcessFile.isEntryStyle
            || toProcessFile.isProjectConfig
        ) {
            initBuildFiles.unshift(toProcessFile);
        }
        else if (toProcessFile.isImg || isCustomInclude) {
            // by default all image files will be processed and output as for
            // we cannot analysis the used image resources correctly
            // add custom included files as default init process files
            initBuildFiles.push(toProcessFile);
        }

        processFiles.push(toProcessFile);
    };

    logger.debug('load files', rootDir, sourceDir);
    traverseFiles(rootDir, filterFiles);

    return {
        root: rootDir,
        sourceDir,
        files: processFiles,
        buildFiles: initBuildFiles
    };
}

module.exports = loadProcessFiles;
