/**
 * @file The processor entry
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
/* eslint-disable fecs-prefer-destructure */

const path = require('path');
const {createFile} = require('./FileFactory');
const {findMatchProcessor} = require('./helper/processor');
const registerProcessor = require('./type').registerProcessor;
const {isPromise, md5} = require('../util').helper;
const {analysisNpmComponents} = require('./npm/component');

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

function processEntryScript(file, allFiles, root, componentExtname) {
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

    pages.forEach(
        p => {
            let pageFullPath = path.resolve(file.dirname, p)
                + '.' + componentExtname;
            let pageFile = allFiles.getByFullPath(pageFullPath);
            pageFile && (pageFile.isPageComponent = true);
        }
    );

    let jsonFile = processConfigInfo(file, root, file);
    jsonFile.isAppConfig = true;

    allFiles.push(jsonFile);
}

function processComponentScript(file, root) {
    processConfigInfo(file, root, file.owner);
}

/**
 * Compile File
 *
 * @param {Object} file the file to compile
 * @param {BuildManager} buildManager the build manager
 */
function compile(file, buildManager) {
    let {cache, logger, root, rules, appType, files: allFiles} = buildManager;
    let {output: outputOpts} = buildManager.buildConf;
    let processors = findMatchProcessor(file, rules, buildManager);
    logger.debug('compile file:', file.path, processors.length);

    for (let i = 0, len = processors.length; i < len; i++) {
        let item = processors[i];
        let {handler, options: opts, rext} = item;
        logger.debug(`compile file ${file.path}, using ${item.name}: `, opts);

        let result = handler(file, {
            cache,
            config: opts,
            appType,
            logger,
            root,
            output: outputOpts
        });
        if (!result) {
            continue;
        }

        rext && (file.rext = rext);

        if (isPromise(result)) {
            buildManager.addAsyncTask(file, result);
            continue;
        }

        if (result.isComponent) {
            file.release = false;
            file.isComponent = true;
            compileComponent(result, file, buildManager);
        }
        else {
            buildManager.updateFileCompileResult(file, result);
        }
    }

    if (file.isEntryScript) {
        processEntryScript(file, allFiles, root, buildManager.componentExtname);
    }
    else if (file.isPageScript || file.isComponentScript) {
        processComponentScript(file, root);
    }

    file.md5 = md5(file.content);
}

function compileComponent(component, file, buildManager) {
    let tplFile = component.tpl;
    if (tplFile) {
        // tpl compile should ahead of the script part to extract ref info in advance
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
        compile(scriptFile, buildManager);

        if (scriptFile.config && scriptFile.config.usingComponents) {
            analysisNpmComponents(
                scriptFile.config.usingComponents,
                scriptFile,
                buildManager
            );
        }
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
