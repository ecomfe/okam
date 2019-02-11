/**
 * @file The component json processor
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const {file: fileUtil, string: strUtil} = require('../../util');
const {getFileName, relative: getRelative} = fileUtil;
const {toHyphen} = strUtil;
const USING_COMPONENT_KEY = 'usingComponents';
const {
    getCompFilesInfoByAppType,
    isFileInSourceDir
} = require('../helper/component');

/**
 * Add component same name files
 *
 * @inner
 * @param {Object} scriptFile the component script file
 * @param {Object} options the process options
 */
function addComponentSameNameFiles(scriptFile, options) {
    const {dirname: currDir, path: relPath} = scriptFile;
    const scriptFileName = getFileName(relPath);
    // fullPath
    let filePathBase = path.join(currDir, scriptFileName);

    const {
        root,
        addFile,
        sourceDir,
        getFileByFullPath,
        appType,
        wx2swan,
        componentExtname,
        logger
    } = options;

    let compFilesInfo = getCompFilesInfoByAppType(
        filePathBase,
        {
            appType,
            wx2swan,
            componentExtname,
            compileContext: options
        }
    );

    let {componentType, missingMustFileExtnames, fileExtnameMap} = compFilesInfo;
    let jsonFile;
    if (!isFileInSourceDir(scriptFile.path, sourceDir)) {
        Object.keys(fileExtnameMap || {}).forEach(k => {
            let fileObj = addFile(fileExtnameMap[k]);

            if (fileObj.isJson) {
                jsonFile = fileObj;
            }
        });
    }
    else {
        jsonFile = getFileByFullPath(`${filePathBase}.json`);
        if (jsonFile && !jsonFile.owner) {
            Object.keys(fileExtnameMap || {}).forEach(k => {
                addFile(fileExtnameMap[k]);
            });
        }
    }

    // all must have js script except quick
    if (componentType && scriptFile) {
        scriptFile[componentType] = true;
    }

    if (jsonFile) {
        jsonFile.isComponentConfig = true;
        jsonFile.component = scriptFile;
        addFile(fileExtnameMap.json);
    }

    if (missingMustFileExtnames.length) {
        let compFile = getRelative(filePathBase, root);
        missingMustFileExtnames.forEach(ext => {
            logger.error(`missing component file: 「${compFile}.${ext}」.`);
        });
    }
}

/**
 * Analysis native component
 *
 * @inner
 * @param {Object} scriptFile the component script file
 * @param {Object} options the process options
 */
function analyseNativeComponent(scriptFile, options) {
    // check whether component is analysed, if true, ignore
    if (scriptFile.isAnalysedComponents) {
        return;
    }
    scriptFile.isAnalysedComponents = true;

    let {appType} = options;
    if (appType === 'quick') {
        return;
    }

    // add native component definition files
    addComponentSameNameFiles(scriptFile, options);
}

/**
 * Process the component dependence sub components based on `usingComponent`
 * info defined in json.
 *
 * @param {Object} file the file to process
 * @param {Object} options the compile options
 * @return {{content: string}}
 */
function compile(file, options) {
    const {resolve: resolveDep, logger} = options;

    try {
        let componentConf = JSON.parse(file.content.toString());
        let usingComponents = componentConf[USING_COMPONENT_KEY];
        if (!usingComponents || !file.component) {
            return {content: file.content};
        }

        let result = {};
        let scriptFile = file.component;
        Object.keys(usingComponents).forEach(k => {
            let value = usingComponents[k];
            if (!value) {
                return;
            }

            let resolvePath = resolveDep(
                scriptFile, value
            );
            result[toHyphen(k)] = resolvePath || value;

            let resolveModInfo = scriptFile.resolvedModIds[value];
            let componentFile = resolveModInfo && resolveModInfo.file;
            componentFile && analyseNativeComponent(componentFile, options);
        });

        // update usingComponent information
        componentConf[USING_COMPONENT_KEY] = result;

        return {
            content: JSON.stringify(componentConf, null, 4)
        };
    }
    catch (ex) {
        logger.error(
            `Parse component config ${file.path} fail`,
             ex.stack || ex.toString()
        );
    }

    return {content: file.content};
}

module.exports = exports = compile;
