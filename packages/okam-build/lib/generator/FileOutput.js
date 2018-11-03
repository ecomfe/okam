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
const fileUtil = require('../util').file;

function outputFile(file, targetPath, logger) {
    if (file.isProjectConfig && fileUtil.isFileExists(targetPath)) {
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

function getOutputPath(filePath, file, options) {
    let {componentPartExtname, outputPathMap = {}, getCustomPath: getPath} = options;

    let result;
    if (file.isProjectConfig) {
        result = outputPathMap.projectConfig;
    }
    else if (file.isEntryScript) {
        result = outputPathMap.entryScript;
    }
    else if (file.isEntryStyle) {
        result = outputPathMap.entryStyle;
    }
    else if (file.isAppConfig) {
        result = outputPathMap.appConfig;
    }
    else {
        if (file.isNpm) {
            result = file.resolvePath || filePath;
        }
        else {
            result = filePath;
        }

        if (file.isTpl && !file.rext) {
            file.rext = componentPartExtname.tpl;
        }

        let rext = file.rext;
        if (rext) {
            result = result.replace(/\.\w+$/, '.' + rext);
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

function getComponentOutputFilePath(partFile, owner, options) {
    let {componentPartExtname} = options;
    if (partFile.isJson) {
        partFile.rext = componentPartExtname.config;
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

    let outputPath = getOutputPath(owner.path, partFile, options);
    if (!outputPath) {
        return;
    }

    return outputPath;
}

function mergeComponentStyleFiles(styleFiles, rootDir) {
    let len = styleFiles.length;
    if (!len) {
        return;
    }

    if (styleFiles.length === 1) {
        return styleFiles[0];
    }

    let content = [];
    styleFiles.forEach(item => {
        content.push(item.content);
    });

    return createFile({
        fullPath: styleFiles[0].fullPath,
        isVirtual: true,
        isStyle: true,
        data: content.join('\n')
    }, rootDir);
}

function isComponentFile(f) {
    return f && (f.isPageComponent || f.isComponent);
}

function addFileOutputTask(allTasks, options, file) {
    if (file.release === false || file.processing) {
        return;
    }

    let {outputDir} = options;
    let ownerFile = file.owner;
    let outputRelPath = isComponentFile(ownerFile)
        ? getComponentOutputFilePath(file, ownerFile, options)
        : getOutputPath(file.path, file, options);
    if (!outputRelPath) {
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

        mkdirp.sync(outputDir);

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

        this.initAsynTaskOutput(buildManager, this.outputOpts);
    }

    initAsynTaskOutput(buildManager, outputOpts) {
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

    initFileOutputTask(f, taskInititer) {
        if (isComponentFile(f)) {
            let styleFileArr = [];
            f.subFiles && f.subFiles.forEach(subFile => {
                if (subFile.isStyle) {
                    styleFileArr.push(subFile);
                }
                else {
                    taskInititer(subFile);
                }
            });

            let styleFile = mergeComponentStyleFiles(styleFileArr, this.root);
            if (styleFile) {
                taskInititer(styleFile);
            }
        }
        else {
            f.subFiles && f.subFiles.forEach(
                subFile => taskInititer(subFile)
            );
            taskInititer(f);
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
}

module.exports = exports = FileOutput;
