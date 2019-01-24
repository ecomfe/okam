/**
 * @file The processor entry
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
/* eslint-disable fecs-prefer-destructure */

const {createFile} = require('./FileFactory');
const {findMatchProcessor, getBuiltinProcessor} = require('./helper/processor');
const {getEventSyntaxPlugin, getFilterSyntaxPlugin, getModelSyntaxPlugin} = require('./helper/init-view');
const registerProcessor = require('./type').registerProcessor;
const {isPromise} = require('../util').helper;
const {toHyphen} = require('../util').string;
const {
    relative,
    replaceFileName,
    getFileName,
    getRequirePath
} = require('../util').file;

const {addProcessEntryPages} = require('./helper/component');

function processConfigInfo(file, root, owner) {
    let config = file.config;
    if (!config) {
        return;
    }

    let jsonFile = createFile({
        isVirtual: true,
        data: JSON.stringify(config, null, 4),
        fullPath: (owner || file).fullPath + '.json'
    }, root);
    jsonFile.isConfig = true;
    owner && owner.addSubFile(jsonFile);
    return jsonFile;
}

function processFilterInfo(file, owner, buildManager) {
    let filters = file.filters;
    if (!filters) {
        return;
    }

    let {code} = filters;
    if (!code) {
        return;
    }

    let {root, buildConf} = buildManager;
    let outputConf = buildConf.output;
    let componentPartExtname = outputConf
        ? outputConf.componentPartExtname : {};
    let filterExt = componentPartExtname.filter || 'js';
    let fullPath = owner.fullPath;
    fullPath = replaceFileName(
        fullPath, getFileName(fullPath) + `.${filterExt}`
    );

    let filterFile = createFile({
        isVirtual: true,
        data: code,
        fullPath
    }, root);
    filterFile.isFilter = true;
    filters.file = filterFile;
    owner.addSubFile(filterFile);
    return filterFile;
}

function processEntryScript(file, buildManager) {
    let {root, files: allFiles, logger} = buildManager;
    let appConfig = file.config || {};
    file.config = appConfig;

    let pages = appConfig.pages || [];
    appConfig.pages = pages;

    // add page of subPackages
    const subPackages = appConfig.subPackages;
    if (subPackages && subPackages.length > 0) {
        const subPackagesPages = subPackages.map(
            pkg => {
                if (pkg.pages && pkg.pages.length > 0) {
                    return pkg.pages.map(
                        subPage => pkg.root + '/' + subPage);
                }
                return [];
            })
            .reduce((a, b) => a.concat(b));
        pages = pages.concat(subPackagesPages);
    }

    let allPageFiles = [];
    let pageFileMap = {};

    addProcessEntryPages(
        pages, pageFileMap, allPageFiles,
        file.dirname, buildManager
    );

    // resolve page path as new path if needed, currently only for quick app
    if (buildManager.resolvePageNewPath) {
        buildManager.resolvePageNewPath(allPageFiles);
        buildManager.normalizeAppPageConfig(pageFileMap, appConfig, file.dirname);
    }

    let jsonFile = processConfigInfo(file, root, file);
    if (!jsonFile) {
        logger.error('missing app `config` property information in', file.path);
        return;
    }
    jsonFile.isAppConfig = true;

    allFiles.push(jsonFile);

    buildManager.addNeedBuildFile(jsonFile);
}

function processComponentScript(buildManager, file) {
    let {root} = buildManager;
    let jsonFile = processConfigInfo(file, root, file.owner);
    if (jsonFile) {
        jsonFile.component = file;
        jsonFile.isComponentConfig = true;
        compile(jsonFile, buildManager);
    }
    let filterFile = processFilterInfo(file, file.owner, buildManager);
    filterFile && buildManager.addNeedBuildFile(filterFile);
}

/**
 * Process file using the given processor
 *
 * @inner
 * @param {Object} file the file to process
 * @param {Object} processor the processor to use
 * @param {BuildManager} buildManager the build manager
 */
function processFile(file, processor, buildManager) {
    let {compileContext, logger} = buildManager;
    let {handler, options: opts, rext} = processor;
    logger.debug(`compile file ${file.path}, using ${processor.name}: `, opts);

    let result = handler(file, Object.assign({
        config: opts
    }, compileContext));
    if (!result) {
        return;
    }

    rext && (file.rext = rext);

    if (isPromise(result)) {
        buildManager.addAsyncTask(file, result);
        return;
    }

    if (result.isSfcComponent) {
        compileComponent(result, file, buildManager);
        result = {content: file.content};
    }
    buildManager.updateFileCompileResult(file, result);
}

/**
 * Compile File
 *
 * @param {Object} file the file to compile
 * @param {BuildManager} buildManager the build manager
 */
function compile(file, buildManager) {
    let {logger, rules} = buildManager;
    let processors = findMatchProcessor(file, rules, buildManager);
    logger.debug('compile file:', file.path, processors.length);

    file.allowRelease = true; // add allow release flag

    for (let i = 0, len = processors.length; i < len; i++) {
        processFile(file, processors[i], buildManager);
    }

    if (file.isEntryScript) {
        processEntryScript(file, buildManager);
    }
    else if (file.isPageScript || file.isComponentScript) {
        processComponentScript(buildManager, file);
    }

    buildManager.emit('buildFileDone', file);
}

/**
 * Get custom component tags
 *
 * @inner
 * @param {Object} config the component config
 * @return {?Array.<string>}
 */
function getCustomComponentTags(config) {
    let {usingComponents} = config || {};
    if (!usingComponents) {
        return;
    }

    return Object.keys(usingComponents).map(k => toHyphen(k));
}

function getImportComponents(file, globalComponents, allTags) {
    let result = {};
    globalComponents && Object.keys(globalComponents).forEach(k => {
        if (allTags[k]) {
            let {isNpmMod, modPath} = globalComponents[k];
            if (!isNpmMod) {
                modPath = getRequirePath(modPath, file.fullPath);
            }

            result[k] = modPath;
        }
    });
    return Object.keys(result).length ? result : null;
}

/**
 * Get need to import filter modules
 *
 * @inner
 * @param {Array.<string>} usedFilters the used filter names
 * @param {Object} scriptFile the script file to declare the local filter
 * @param {BuildManager} buildManager the build manager
 * @return {?Array.<Object>}
 */
function getImportFilterModules(usedFilters, scriptFile, buildManager) {
    if (!usedFilters) {
        return;
    }

    let filterModules = [];
    let {file: filterFile, filterNames: definedFilters} = scriptFile.filters || {};
    let hasFilterUsed = definedFilters && usedFilters.some(item => {
        if (definedFilters.includes(item)) {
            return true;
        }
        return false;
    });

    if (!hasFilterUsed) {
        return filterModules;
    }

    if (filterFile) {
        let src = relative(filterFile.path, scriptFile.dirname);
        if (src.charAt(0) !== '.') {
            src = './' + src;
        }
        filterModules.push({src, filters: definedFilters});
    }
    else {
        filterModules.push({filters: definedFilters});
    }

    return filterModules;
}

function compileNativeComponent(component, buildManager) {
    let scriptFile = component.script;
    if (scriptFile) {
        compile(scriptFile, buildManager);
    }

    let styleFiles = component.styles || [];
    styleFiles.forEach(item => compile(item, buildManager));
}

function compileComponent(component, file, buildManager) {
    if (file.isNativeComponent) {
        return compileNativeComponent(component, buildManager);
    }

    let tplFile = component.tpl;
    if (tplFile) {
        // tpl compile should ahead of the script part to extract ref info
        compile(tplFile, buildManager);
    }

    let scriptFile = component.script;
    if (scriptFile) {
        if (file.isPageComponent) {
            scriptFile.isPageScript = true;
        }
        else {
            scriptFile.isComponentScript = true;
        }

        // pass the refs info defined in tpl to script
        scriptFile.tplRefs = tplFile.refs;

        // init global components used by the component
        scriptFile.injectComponents = getImportComponents(
            scriptFile,
            buildManager.globalComponents,
            tplFile.tags,
        );
        buildManager.logger.debug(
            scriptFile.path,
            'inject components',
            scriptFile.injectComponents
        );
        compile(scriptFile, buildManager);

        // init tpl transform plugins
        let customComponentTags = getCustomComponentTags(scriptFile.config);
        let tplPlugins = [
            [
                getEventSyntaxPlugin(buildManager.appType),
                {customComponentTags}
            ]
        ];

        let enableFilter = buildManager.isEnableFilterSupport();
        if (enableFilter) {
            let filterModules = getImportFilterModules(
                tplFile.filters, scriptFile, buildManager
            );
            filterModules && tplPlugins.push([
                getFilterSyntaxPlugin(buildManager.appType),
                {filters: filterModules}
            ]);
        }

        // 在事件处理之后处理
        let enableModel = buildManager.isEnableModelSupport();
        if (enableModel) {
            let {componentConf} = buildManager;
            let templateConf = (componentConf && componentConf.template) || {};
            tplPlugins.push([
                getModelSyntaxPlugin(buildManager.appType),
                {
                    customComponentTags,
                    modelMap: templateConf.modelMap
                }
            ]);
        }

        // transform template event/filter syntax
        let tplProcessor = getBuiltinProcessor('view', {
            plugins: tplPlugins
        });
        processFile(tplFile, tplProcessor, buildManager);
    }

    let styleFiles = component.styles || [];
    styleFiles.forEach(item => compile(item, buildManager));
}

exports.registerProcessor = function (customProcessors) {
    if (!customProcessors) {
        return;
    }

    if (!Array.isArray(customProcessors)) {
        let result = [];
        Object.keys(customProcessors).forEach(
            k => result.push(
                Object.assign({name: k}, customProcessors[k])
            )
        );
        customProcessors = result;
    }

    customProcessors.forEach(item => registerProcessor(item));
};

exports.compile = compile;
