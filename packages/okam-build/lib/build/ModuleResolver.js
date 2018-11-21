/**
 * @file Module path resolver
 * @author sparklewhy@gmail.com
 */

'use strict';

const resolve = require('resolve');
const pathUtil = require('path');

function addResolveExtension(result, extensionName) {
    if (!extensionName.startsWith('.')) {
        extensionName = '.' + extensionName;
    }

    if (result.indexOf(extensionName) === -1) {
        result.push(extensionName);
    }
}

function createModuleIgnoreFilter(ignore) {
    if (!ignore) {
        return;
    }

    if (typeof ignore === 'function') {
        return ignore;
    }

    if (!Array.isArray(ignore)) {
        ignore = [ignore];
    }

    return moduleId => ignore.some(item => {
        if (typeof item === 'string') {
            return item === moduleId;
        }
        else if (item instanceof RegExp) {
            return item.test(moduleId);
        }
        return false;
    });
}

class ModuleResolver {

    constructor(opts) {
        let {logger, appType, resolve, extensions} = opts;
        this.logger = logger;
        this.appType = appType;
        this.onResolve = resolve && resolve.onResolve;
        this.extensions = this.initResolveExtensionNames(resolve, extensions);
        this.resolveFilter = createModuleIgnoreFilter(resolve && resolve.ignore);
    }

    initResolveExtensionNames(resolve, extensions) {
        let result = ['.js'];
        extensions && extensions.forEach(k => addResolveExtension(result, k));
        resolve && resolve.extensions && resolve.extensions.forEach(
            k => addResolveExtension(result, k)
        );
        addResolveExtension(result, 'ts');
        return result;
    }

    /**
     * Resolve module id file path
     *
     * @param {string} requireModId the module id to require
     * @param {string|Object} file the full file path or virtual file object
     *        to require the given module id
     * @return {?string}
     */
    resolve(requireModId, file) {
        this.onResolve && this.onResolve(requireModId, file);

        if (this.resolveFilter && this.resolveFilter(requireModId, this.appType)) {
            return;
        }

        let depFile;
        let logger = this.logger;
        let filePath = typeof file === 'string' ? file : file.fullPath;
        try {
            depFile = resolve.sync(
                requireModId,
                {
                    extensions: this.extensions,
                    basedir: pathUtil.dirname(filePath)
                }
            );

            if (depFile === requireModId) {
                logger.warn('resolve native module', depFile, 'in', filePath);
                return;
            }
            logger.debug('resolve module', requireModId, filePath, depFile);
        }
        catch (ex) {
            logger.error('resolve dep module:', requireModId, 'in', filePath, 'fail');
        }

        return depFile;
    }
}

module.exports = ModuleResolver;
