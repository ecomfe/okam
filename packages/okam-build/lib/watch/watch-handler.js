/**
 * @file File change handler
 * @author sparkelwhy@gmail.com
 */

'use strict';

const {colors, Timer} = require('../util');

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
    if (file.isImg) {
        // xxx: skip image file rebuild to avoid rebuild repeatly
        file.processing || releaseFiles.files.push(file);
        return;
    }

    // analyse the style file dependences and determine which style file need to recompile
    if (file.isStyle && !file.owner) {
        // TODO init dep map global to search file by dep effectively
        let changeFiles = buildManager.getFilesByDep(file.path);
        logger.debug(file.path, 'changeFiles:' + changeFiles.length);
        if (changeFiles.length) {
            changeFiles.forEach(item => {
                compileFile(
                    buildManager, item, releaseFiles
                );
            });
            return;
        }
    }

    let result = buildManager.compile(file);
    if (!result) {
        return;
    }

    // skip component file release
    if (!file.isPageComponent && !file.isComponent) {
        releaseFiles.files.push(file);
    }

    // process script deps
    file.isScript && (file.deps || []).forEach(depPath => {
        let depFile = buildManager.getFileByPath(depPath);
        logger.debug('process dep', file.path, depPath, !!depFile, depFile && depFile.compiled);
        if (!depFile || !depFile.compiled) {
            compileFile(buildManager, depPath, releaseFiles);
        }
    });

    (file.subFiles || []).forEach(
        subFile => compileFile(buildManager, subFile, releaseFiles)
    );
}

function rebuildFiles(file, buildManager) {
    let timer = new Timer();
    timer.start();

    let releaseFiles = {
        files: [],
        processed: {}
    };
    compileFile(buildManager, file, releaseFiles);

    let outputFiles = releaseFiles.files;
    if (outputFiles.length) {
        let logger = buildManager.logger;
        buildManager.release(outputFiles).then(
            () => logger.info(
                'rebuild',
                colors.cyan(outputFiles.length),
                'files done:',
                colors.grey(timer.tick())
            )
        );
    }
}

module.exports = exports = {
    fileDel(file, buildManager) {
        // do nothing
    },

    fileAdd(file, buildManager) {
        rebuildFiles(file, buildManager);
    },

    fileChange(file, buildManager) {
        rebuildFiles(file, buildManager);
    }
};
