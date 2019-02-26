/**
 * @file File change handler
 * @author sparkelwhy@gmail.com
 */

'use strict';

const path = require('path');
const {colors, Timer} = require('../util');

function filterChangedFiles(depFile, changedFiles) {
    let result = [];
    changedFiles.forEach(item => {
        if (depFile.isStyle) {
            if (item.isStyle || item.isComponent) {
                result.push(item);
            }
        }
        else if (depFile.isTpl) {
            item.isComponent && result.push(item);
        }
        else if (depFile.isScript) {
            item.isComponent && result.push(item);
        }
    });
    return result;
}

function compileFile(buildManager, file, releaseFiles) {
    let logger = buildManager.logger;
    typeof file === 'string' && (file = buildManager.createFile(file));

    // check file whether is processed
    let processed = releaseFiles.processed;
    if (processed[file.path]) {
        return;
    }
    processed[file.path] = true;

    file.reset();

    logger.debug('compile file', file.path);
    releaseFiles.processFileNum += 1;
    if (file.isImg) {
        file.allowRelease = true;
        // xxx: skip image file rebuild to avoid rebuild in frequency
        file.processing || releaseFiles.add(file);
        return;
    }

    // analyse the style file dependence and determine which style file need to recompile
    if (file.isStyle || file.isScript || file.isTpl) {
        // TODO init dep map global to search file by dep effectively
        let changedFiles = buildManager.getFilesByDep(file.path);
        logger.debug(file.path, 'changedFiles:' + changedFiles.length);
        changedFiles = filterChangedFiles(file, changedFiles);
        if (changedFiles.length) {
            changedFiles.forEach(
                item => compileFile(buildManager, item, releaseFiles)
            );
            return;
        }
    }

    let result = buildManager.compile(file);
    if (result) {
        buildManager.buildDependencies();
    }
}

function rebuildFiles(file, buildManager) {
    let timer = new Timer();
    timer.start();

    let outputFiles = [];
    let addReleaseFile = function (file) {
        // skip sub file and repeated file
        if (!file.owner && !outputFiles.includes(file)) {
            outputFiles.push(file);
        }
    };
    let releaseFiles = {
        processFileNum: 0,
        add: addReleaseFile,
        processed: {}
    };

    buildManager.on('buildFileDone', addReleaseFile);
    compileFile(buildManager, file, releaseFiles);
    buildManager.updateRouterFileContent
        && buildManager.updateRouterFileContent(timer);
    buildManager.removeListener('buildFileDone', addReleaseFile);

    if (outputFiles.length) {
        let logger = buildManager.logger;
        buildManager.release(outputFiles).then(
            () => logger.info(
                'rebuild',
                colors.cyan(releaseFiles.processFileNum),
                'output',
                colors.cyan(outputFiles.length),
                'files done:',
                colors.grey(timer.tick())
            )
        );
    }
}

module.exports = exports = {
    fileDel(file, buildManager) {
        let dirname = path.dirname(
            path.join(buildManager.root, file)
        );
        buildManager.cache.clearDirFileListInfo(dirname);
    },

    fileAdd(file, buildManager) {
        let dirname = path.dirname(
            path.join(buildManager.root, file)
        );
        buildManager.cache.clearDirFileListInfo(dirname);
        rebuildFiles(file, buildManager);
    },

    fileChange(file, buildManager) {
        rebuildFiles(file, buildManager);
    }
};
