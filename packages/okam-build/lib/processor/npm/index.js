/**
 * @file Resolve npm dependencies
 * @author sparklewhy@gmail.com
 */

'use strict';

const getRequirePath = require('../../util').file.getRequirePath;

function resolveDepRequireId(buildManager, file, requireModId) {
    if (!requireModId) {
        return requireModId;
    }

    let {fullPath, isNpm: isNpmMod, resolvedModIds} = file;
    resolvedModIds || (file.resolvedModIds = resolvedModIds = {});
    if (resolvedModIds[requireModId]) {
        return requireModId;
    }

    resolvedModIds[requireModId] = true;

    let isRelModId = /^\./.test(requireModId);
    let depFile;
    let {files: fileFactory, logger} = buildManager;
    logger.debug('resolve', file.path, requireModId);
    if (isNpmMod || !isRelModId) {
        depFile = buildManager.resolve(requireModId, fullPath);
        if (!depFile) {
            return;
        }

        file.addDeps(fileFactory.getRelativePath(depFile));

        depFile = fileFactory.addFile(depFile);
        file.isNpmWxCompScript && (depFile.isNpmWxCompScript = true);
        file.isNpmSwanCompScript && (depFile.isNpmSwanCompScript = true);
    }

    if (!isRelModId) {
        let rebaseRelPath = isNpmMod
            ? file.resolvePath
            : file.path;
        requireModId = getRequirePath(
            depFile.resolvePath,
            rebaseRelPath
        );
    }
    resolvedModIds[requireModId] = true;
    return requireModId;
}

exports.resolve = resolveDepRequireId;
