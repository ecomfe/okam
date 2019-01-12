/**
 * @file Module path resolver
 * @author sparklewhy@gmail.com
 */

'use strict';

const resolve = require('resolve');
const pathUtil = require('path');
const {file: fileUtil} = require('../util');

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

function createModuleAliasConverter(alias) {
    if (!alias) {
        return;
    }

    let aliasMatcherList = [];
    Object.keys(alias).forEach(k => {
        let v = alias[k];
        let normalize;
        let match;
        let len = k.length;
        if (k.charAt(len - 1) === '$') {
            match = k.substring(0, len - 1);
            normalize = moduleId => v;
        }
        else {
            match = moduleId => moduleId.indexOf(k) === 0;
            normalize = moduleId => (v + moduleId.substr(k.length));
        }

        aliasMatcherList.push({match, normalize});
    });

    return moduleId => {
        let process;
        aliasMatcherList.some(item => {
            let {match, normalize} = item;

            if (typeof match === 'string') {
                if (match === moduleId) {
                    process = normalize;
                    return true;
                }
            }
            else if (match(moduleId)) {
                process = normalize;
                return true;
            }

            return false;
        });

        return process ? process(moduleId) : moduleId;
    };
}

class ModuleResolver {

    constructor(opts) {
        let {logger, appType, resolve, extensions} = opts;
        this.logger = logger;
        this.appType = appType;
        this.onResolve = resolve && resolve.onResolve;
        this.extensions = this.initResolveExtensionNames(resolve, extensions);
        this.resolveFilter = createModuleIgnoreFilter(resolve && resolve.ignore);
        this.resolveAlias = createModuleAliasConverter(resolve && resolve.alias);
        this.initModuleResolvePathInfo(resolve && resolve.modules);
    }

    initModuleResolvePathInfo(moduleDirs) {
        if (!moduleDirs) {
            return;
        }

        if (!Array.isArray(moduleDirs)) {
            moduleDirs = [moduleDirs];
        }

        let resolvePaths = [];
        let resolveModuleDirs = [];
        moduleDirs.forEach(item => {
            if (typeof item !== 'string') {
                return;
            }

            if (pathUtil.isAbsolute(item)) {
                resolvePaths.push(item);
            }
            else {
                resolveModuleDirs.push(item);
            }
        });

        this.moduleDirs = resolveModuleDirs;
        this.modulePaths = resolvePaths.length ? resolvePaths : null;
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
     * @param {Object=} opts the extra resolve options
     * @return {?string}
     */
    resolve(requireModId, file, opts) {
        this.onResolve && this.onResolve(requireModId, file);

        if (this.resolveFilter && this.resolveFilter(requireModId, this.appType)) {
            return;
        }

        let logger = this.logger;
        if (this.resolveAlias) {
            let newRequiredModId = this.resolveAlias(requireModId);
            logger.debug('resolve alias', requireModId, newRequiredModId);
            requireModId = newRequiredModId;
        }

        let depFile;
        let filePath = typeof file === 'string' ? file : file.fullPath;
        try {
            let resolveOpts = {
                extensions: this.extensions,
                basedir: pathUtil.dirname(filePath),
                moduleDirectory: this.moduleDirs,
                paths: this.modulePaths
            };
            opts && Object.assign(resolveOpts, opts);
            depFile = resolve.sync(
                requireModId, resolveOpts
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
