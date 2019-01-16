/**
 * @file Quick app build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const BuildManager = require('../BuildManager');
const {registerProcessor} = require('../../processor');
const {relative} = require('../../util').file;

const VALIDATED_DATA_TYPES = ['public', 'protected', 'private'];
const CHANGED_PAGE_PATH_PLACEHOLDER = '#$CHANGED_PATH$#';

function getNewPagePath(pagePath, extname) {
    let lastDotIdx = pagePath.lastIndexOf('.');
    if (lastDotIdx !== -1) {
        pagePath = pagePath.substring(0, lastDotIdx);
    }
    return pagePath + '/index.' + extname;
}

function resolveNewPage(root, resolvePath, relativeRoot) {
    let newPage = relative(path.join(root, resolvePath), relativeRoot);
    return newPage.substring(0, newPage.lastIndexOf('.'));
}

function initNewPkgResolve(pkg, result, opts) {
    let {root, relativeRoot, pageFileMap} = opts;
    let {root: pkgRoot, pages} = pkg;
    pages && pages.forEach(subPage => {
        let pagePath = pkgRoot + '/' + subPage;
        let {resolvePath} = pageFileMap[pagePath] || {};
        let newSubPage = subPage;
        let newPkgRoot = pkgRoot;
        if (resolvePath) {
            newSubPage = resolveNewPage(root, resolvePath, relativeRoot);

            let firstSlashIdx = newSubPage.indexOf('/');
            newPkgRoot = newSubPage.substring(0, firstSlashIdx);
            newSubPage = newSubPage.substr(firstSlashIdx + 1);
        }

        let subPageList = result[newPkgRoot];
        subPageList || (subPageList = result[newPkgRoot] = []);
        subPageList.push(newSubPage);
    });

    return result;
}

function resolveSubPkgList(subPackages, root, relativeRoot, pageFileMap) {
    let result = {};
    let resolveOpts = {
        root, relativeRoot, pageFileMap
    };
    subPackages.forEach(pkg => {
        initNewPkgResolve(
            pkg, result, resolveOpts
        );
    });

    let newSubPkgs = [];
    Object.keys(result).forEach(k => {
        newSubPkgs.push({
            root: k,
            pages: result[k]
        });
    });
    return newSubPkgs;
}

function resolvePageList(pages, root, relativeRoot, pageFileMap) {
    let result = [];
    let upMap = {};
    pages.forEach(pagePath => {
        let {resolvePath} = pageFileMap[pagePath] || {};
        if (resolvePath) {
            let newPagePath = resolveNewPage(root, resolvePath, relativeRoot);
            result.push(newPagePath);
            upMap[pagePath] = newPagePath;
        }
        else {
            result.push(pagePath);
        }
    });
    return {
        pages: result,
        changedPages: upMap
    };
}

class BuildQuickAppManager extends BuildManager {

    /**
     * Normalize app page config value
     *
     * @param {Object} pageFileMap page file map
     * @param {Object} appConfig the original app config
     * @param {string} relativeRoot the root to relative
     */
    normalizeAppPageConfig(pageFileMap, appConfig, relativeRoot) {
        let {pages, subPackages} = appConfig;

        let root = this.root;
        let {pages: newPages, changedPages} = resolvePageList(
            pages, root, relativeRoot, pageFileMap
        );
        appConfig.pages = newPages;
        this.changedPagePathMap = changedPages;

        if (subPackages && subPackages.length > 0) {
            appConfig.subPackages = resolveSubPkgList(
                subPackages, root, relativeRoot, pageFileMap
            );
        }
    }

    /**
     * Resolve page component new paths.
     * In quick app, only allow to have one page component in the same directory.
     *
     * @param {Array.<Object>} pageFiles all page files
     */
    resolvePageNewPath(pageFiles) {
        let dirPageMap = {};
        pageFiles.forEach(item => {
            let {dirname} = item;
            let pageList = dirPageMap[dirname];
            pageList || (pageList = dirPageMap[dirname] = []);
            pageList.push(item);
        });

        Object.keys(dirPageMap).forEach(k => {
            let pageList = dirPageMap[k];
            if (pageList.length <= 1) {
                return;
            }

            pageList.forEach(page => {
                page.resolvePath = getNewPagePath(page.path, page.extname);
            });
        });
    }

    /**
     * @override
     */
    onAddNewFile(file) {
        super.onAddNewFile(file);

        if (file.extname === 'ux') {
            file.isNativeComponent = true;
        }
    }

    /**
     * Get all page config files
     *
     * @return {Array.<Object>}
     */
    getAllPageConfigFiles() {
        let result = [];

        this.files.forEach(item => {
            if (!item.isPageComponent) {
                return;
            }

            let subFiles = item.subFiles;
            let found;

            subFiles && subFiles.some(item => {
                if (item.isConfig) {
                    found = item;
                    return true;
                }
                return false;
            });

            found && result.push(found);
        });

        return result;
    }

    /**
     * Get all used API features for quick app
     *
     * @return {Array.<string>}
     */
    getAllUsedAPIFeatures() {
        let result = [];

        this.files.forEach(({features}) => {
            if (!features) {
                return;
            }

            for (let i = 0, len = features.length; i < len; i++) {
                let item = features[i];
                if (!result.includes(item)) {
                    result.push(item);
                }
            }
        });

        return result;
    }

    /**
     * Get app config file
     *
     * @return {?Object}
     */
    getAppConfigFile() {
        let found;
        this.files.some(item => {
            if (!item.isEntryScript) {
                return false;
            }

            let subFiles = item.subFiles || [];
            for (let i = 0, len = subFiles.length; i < len; i++) {
                let f = subFiles[i];
                if (f.isConfig) {
                    found = f;
                    return true;
                }
            }
            return true;
        });
        return found;
    }

    /**
     * @override
     */
    loadFiles() {
        super.loadFiles();
        Object.assign(this.compileContext, {
            getAllPageConfigFiles: this.getAllPageConfigFiles.bind(this),
            getAllUsedAPIFeatures: this.getAllUsedAPIFeatures.bind(this)
        });
        this.initAddCSSDependenciesProcessor();
    }

    /**
     * @override
     */
    getFilterTransformOptions() {
        let opts = super.getFilterTransformOptions();
        opts || (opts = {});
        opts.keepFiltersProp = true;
        return opts;
    }

    /**
     * Init the auto adding the css style dependencies processor
     *
     * @private
     */
    initAddCSSDependenciesProcessor() {
        let found;
        this.files.some(item => item.isEntryStyle && (found = item));
        if (!found) {
            return;
        }

        // init addCssDependencies processor options
        registerProcessor({
            addCssDependencies: {
                options: {
                    styleFiles: [
                        path.join(this.root, found.path)
                    ],
                    rext: 'css'
                }
            }
        });
    }

    /**
     * @override
     */
    getAppBaseClassInitOptions(file, config, opts) {
        let result = super.getAppBaseClassInitOptions(file, config, opts);

        let extraData;
        if (opts.isApp) {
            this.entryAppFile = file;
            extraData = {
                changedPagePathMap: CHANGED_PAGE_PATH_PLACEHOLDER
            };
        }

        if (opts.isPage && config) {
            let envConfig = config[this.envConfigKey];
            let dataAccessType = envConfig && envConfig.data;
            if (dataAccessType) {
                if (!VALIDATED_DATA_TYPES.includes(dataAccessType)) {
                    this.logger.warn('illegal quick app page data type:', dataAccessType);
                }

                extraData || (extraData = {});
                extraData.dataAccessType = dataAccessType;
            }
        }

        if (!opts.isApp && this.isEnableFrameworkExtension('watch')) {
            let watchCounter = 0;
            let content = file.content.toString();
            let watchApiCallRegexp = /\.\$watch(\s|\(|,|;|$)/g;
            while (watchApiCallRegexp.exec(content)) {
                watchCounter++;
            }

            extraData || (extraData = {});
            watchCounter && (extraData.watcherCounter = watchCounter);
        }

        if (result && extraData) {
            Object.assign(result, extraData);
        }
        else if (!result && extraData) {
            result = extraData;
        }

        return result;
    }

    /**
     * Get the build clear filter
     *
     * @protected
     * @return {Function}
     */
    getClearFilter() {
        return filePath => {
            let result = filePath.indexOf('src') !== 0;
            return result;
        };
    }

    /**
     * Processor the app config after build done
     */
    onBuildDone() {
        let appConfigFile = this.getAppConfigFile();
        if (appConfigFile) {
            appConfigFile.owner.processed = true;
            appConfigFile.compileReady = true;
            this.compile(appConfigFile);
        }

        // update entry app options
        let content = this.entryAppFile.content;
        let info = this.changedPagePathMap; // used for router
        if (info) {
            let result = {};
            Object.keys(info).forEach(k => {
                let value = info[k];
                result['/' + k] = '/' + value;
            });
            info = JSON.stringify(result);
        }
        else {
            info = 'null';
        }
        this.entryAppFile.content = content.replace(
            '"' + CHANGED_PAGE_PATH_PLACEHOLDER + '"', info
        );
    }
}

module.exports = BuildQuickAppManager;
