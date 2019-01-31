/**
 * @file Output files
 * @author sparklewhy@gamil.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const createFile = require('../processor/FileFactory').createFile;
const {replaceFileName, replaceExtname, isFileExists} = require('../util').file;

function outputFile(file, targetPath, logger) {
    if (file.isProjectConfig && isFileExists(targetPath)) {
        logger.debug('ignore project config file output');
        return;
    }

    mkdirp.sync(path.dirname(targetPath));
    logger.debug('output file', file.path, targetPath);
    return new Promise((resolve, reject) => {
        let errorHandler = err => reject(err);
        file.stream.on(
            'error', errorHandler
        ).pipe(
            fs.createWriteStream(targetPath)
        ).on(
            'error', errorHandler
        ).on('close', () => resolve());
    });
}

function updateFileName(filePath, newFileName) {
    if (!newFileName) {
        return false;
    }

    return replaceFileName(filePath, newFileName);
}

function getOutputPath(filePath, file, options) {
    let {
        componentPartExtname,
        outputPathMap = {},
        getCustomPath: getPath
    } = options;

    let result;
    if (file.isProjectConfig) {
        result = updateFileName(filePath, outputPathMap.projectConfig);
    }
    else if (file.isEntryScript) {
        result = updateFileName(filePath, outputPathMap.entryScript);
    }
    else if (file.isEntryStyle) {
        result = updateFileName(filePath, outputPathMap.entryStyle);
    }
    else if (file.isAppConfig) {
        result = updateFileName(filePath, outputPathMap.appConfig);
    }
    else {
        result = file.resolvePath || filePath;

        if (file.isTpl && !file.rext && componentPartExtname) {
            file.rext = componentPartExtname.tpl;
        }

        let rext = file.rext;
        if (rext) {
            result = replaceExtname(result, rext);
        }
    }

    if (result !== false && typeof getPath === 'function') {
        result = getPath(result || filePath, file);
    }

    if (result === false) {
        return;
    }

    return result || filePath;
}

function getComponentPartOutputFilePath(partFile, owner, options) {
    let {componentPartExtname} = options;
    if (!componentPartExtname) {
        return;
    }

    let filePath = owner.resolvePath || owner.path;
    if (partFile.isJson) {
        partFile.rext = componentPartExtname.config;
    }
    else if (partFile.isFilter) {
        partFile.rext = '';
        filePath = partFile.path;
    }
    else if (partFile.isScript) {
        partFile.rext = componentPartExtname.script;
    }
    else if (partFile.isStyle) {
        partFile.rext = componentPartExtname.style;
    }
    else if (partFile.isTpl) {
        partFile.rext = componentPartExtname.tpl;
    }

    return getOutputPath(filePath, partFile, options);
}

function mergeComponentStyleFiles(styleFiles, rootDir) {
    let len = styleFiles.length;
    if (!len) {
        return;
    }

    let styleFileItem = styleFiles[0];
    if (styleFiles.length === 1) {
        return styleFileItem;
    }

    let content = [];
    styleFiles.forEach(item => {
        content.push(item.content);
    });

    let mergeFile = createFile({
        fullPath: styleFiles[0].fullPath,
        isVirtual: true,
        isStyle: true,
        data: content.join('\n')
    }, rootDir);

    mergeFile.resolvePath = styleFileItem.resolvePath;
    mergeFile.owner = styleFileItem.owner;
    mergeFile.allowRelease = true;
    mergeFile.compiled = true;

    return mergeFile;
}

function isComponentFile(f) {
    return f && (f.isComponent || f.isNativeComponent);
}

function addFileOutputTask(allTasks, options, file) {
    if (file.release === false || file.processing) {
        return;
    }

    let {outputDir, logger} = options;
    let ownerFile = file.owner;
    let outputRelPath = isComponentFile(ownerFile)
        ? getComponentPartOutputFilePath(file, ownerFile, options)
        : getOutputPath(file.path, file, options);
    if (!outputRelPath) {
        logger.debug('skip file release', file.path);
        return;
    }

    allTasks.push(
        outputFile(file, path.join(outputDir, outputRelPath), options.logger)
    );
}

class FileOutput {
    constructor(buildManager, options) {
        let {root, logger, files} = buildManager;
        let {
            dir: outputDir,
            pathMap: outputPathMap,
            componentPartExtname,
            file: getCustomPath
        } = options || {};

        this.buildManager = buildManager;
        this.root = root;
        this.logger = logger;
        this.files = files;
        this.outputOpts = {
            outputDir,
            outputPathMap,
            componentPartExtname,
            getCustomPath,
            logger
        };

        this.initAsyncTaskOutput(buildManager, this.outputOpts);
    }

    initAsyncTaskOutput(buildManager, outputOpts) {
        let {logger, outputDir} = outputOpts;
        buildManager.on('asyncDone', file => {
            let outputRelPath = getOutputPath(file.path, file, outputOpts);
            if (!outputRelPath) {
                return;
            }

            outputFile(file, path.join(outputDir, outputRelPath), logger).then(
                null,
                err => logger.error(
                    `output ${file.path} asyn task result fail:`,
                    err.stack || err.toString()
                )
            );
        });
    }

    initFileOutputTask(f, initTask) {
        if (isComponentFile(f)) {
            let styleFileArr = [];
            f.subFiles && f.subFiles.forEach(subFile => {
                if (subFile.isStyle) {
                    styleFileArr.push(subFile);
                }
                else {
                    initTask(subFile);
                }
            });

            let styleFile = mergeComponentStyleFiles(styleFileArr, this.root);
            if (styleFile) {
                initTask(styleFile);
            }
            initTask(f);
        }
        else {
            f.subFiles && f.subFiles.forEach(
                subFile => initTask(subFile)
            );
            initTask(f);
        }
    }

    release(files) {
        let promises = [];
        let initOutputTask = addFileOutputTask.bind(this, promises, this.outputOpts);

        if (files && !Array.isArray(files)) {
            files = [files];
        }

        if (!files) {
            files = this.buildManager.files;
        }

        files.forEach(f => this.initFileOutputTask(f, initOutputTask));

        return Promise.all(promises).then(
            null,
            err => this.logger.error('build fail:', err.stack || err.toString())
        );
    }

    /**
     * Get the file output path
     *
     * @param {Object} file the file to get output file path
     * @return {string}
     */
    getOutputPath(file) {
        return getOutputPath.call(this, file.path, file, this.outputOpts);
    }
}

module.exports = exports = FileOutput;
