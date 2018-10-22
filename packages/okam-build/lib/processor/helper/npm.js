/**
 * @file Npm module helper
 * @author xiaohong8023@outlook.com
 */

const {file: fileUtil} = require('../../util');
const {getRequirePath} = fileUtil;

const DEP_DIR_NAME = 'node_modules';
const DEP_DIR_NAME_REGEXP = new RegExp(DEP_DIR_NAME, 'g');
const NEW_DEP_DIR_NAME = 'npm';

/**
 * Check whether is npm module file
 *
 * @param {string} modulePath the module relative path
 * @return {boolean}
 */
exports.isNpmModuleFile = function (modulePath) {
    return modulePath.indexOf(DEP_DIR_NAME) === 0;
};

/**
 * Resolve npm module new path to output
 *
 * @param {string} oldPath the old module path
 * @param {string} rebaseDepDir the dep directory to rebase
 * @return {string}
 */
exports.resolveNpmModuleNewPath = function (oldPath, rebaseDepDir) {
    let newPath = rebaseDepDir + oldPath.substr(DEP_DIR_NAME.length + 1);
    // replace all `node_modles` to `npm` to fix weixin cannot find the module
    // if the module path exists `node_module` dir name
    return newPath.replace(DEP_DIR_NAME_REGEXP, NEW_DEP_DIR_NAME);
};

/**
 * Resolve required module id. If resolve fail, return empty.
 *
 * @param {BuildManager} buildManager the build manager
 * @param {Object} file the file to host the required module id
 * @param {string} requireModId the required module id to resolve
 * @return {?string}
 */
exports.resolve = function (buildManager, file, requireModId) {
    if (!requireModId) {
        return requireModId;
    }

    let {fullPath, isNpm: isNpmMod, resolvedModIds: cacheResolveModIds} = file;
    cacheResolveModIds || (file.resolvedModIds = cacheResolveModIds = {});
    let resolveModInfo = cacheResolveModIds[requireModId];
    if (resolveModInfo) {
        return resolveModInfo.id;
    }

    let isRelModId = requireModId.charAt(0) === '.';
    let depFileFullPath = buildManager.resolve(requireModId, fullPath);
    if (!depFileFullPath) {
        return;
    }

    let {files: fileFactory, logger} = buildManager;
    logger.debug('resolve', file.path, requireModId);
    let depFile = fileFactory.addFile(depFileFullPath);
    file.addDeps(depFile.path);
    file.isWxCompScript && (depFile.isWxCompScript = true);
    file.isSwanCompScript && (depFile.isSwanCompScript = true);

    let resolveModId = requireModId;
    if (!isRelModId) {
        let rebaseRelPath = isNpmMod
            ? file.resolvePath
            : file.path;
        resolveModId = getRequirePath(
            depFile.resolvePath,
            rebaseRelPath
        );
    }

    let cacheInfo = {
        id: resolveModId,
        file: depFile
    };
    cacheResolveModIds[requireModId] = cacheInfo;
    cacheResolveModIds[resolveModId] = cacheInfo;

    return resolveModId;
};
