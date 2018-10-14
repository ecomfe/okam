/**
 * @file analysis components dependencies
 * @author xiaohong8023@outlook.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const path = require('path');
const fs = require('fs');

const {
    file: fileUtil,
    require: customRequire
} = require('../../util');

const {nodeModulesToNpm} = require('../helper/npm');

const {isFileExists, relative, getFileState} = fileUtil;
const USING_COMPONENT_KEY = 'usingComponents';

/**
 * cache Component Files
 *
 * __cacheCompFile = {
 *
 *  /fullDir: {
 *
 *      fileName1 : [a, b, c],
 *      fileName2 : [a, b, c]
 *  }
 *
 * }
 * @private
 * @type {Object}
 */
let __cacheCompFile = {};

/**
 * cache Component Files which has been added
 *
 * __cacheAddedComp = {
 *
 *  /fullDir/filename1: true,
 *  /fullDir/filename2: true
 *
 * }
 * @private
 * @type {Object}
 */
let __cacheAddedComp = {};

function resolveNpmComp(buildManager, file, requireModId) {
    return buildManager.resolve(requireModId, file);
}


/**
 * add file and handle .json file
 *
 * @param {string} fullPath ullPath
 * @param {string} name  which need add filename
 * @param {Object} buildManager buildManager
 * @param {Object} jsonFileInfo jsonFileInfo
 */
function addFileAndHandleJson(fullPath, name, buildManager, jsonFileInfo) {

    let {dir: compFile, ext: fileExtname, name: fileName} = path.parse(fullPath);

    if (fileName === name) {
        let fileObj = buildManager.files.addFile(fullPath);

        // flag npm component script
        if (fileExtname === '.js') {
            isFileExists(`${compFile}/${fileName}.wxml`) && (fileObj.isNpmWxCompScript = true);
            isFileExists(`${compFile}/${fileName}.swan`) && (fileObj.isNpmSwanCompScript = true);
        }

        if (fileExtname === '.json') {
            jsonFileInfo.hasJson = true;
            jsonFileInfo.fullPath = fullPath;
            jsonFileInfo.file = fileObj;
        }
    }
}

/**
 * add same name files in current dir and return is there .json file
 *
 * @param {string} fileFullpath fileFullpath
 * @param {Object} buildManager buildManager
 * @return {Object} jsonFileInfo
 *
 * jsonFileInfo = {
 *     hasJson: true
 *     fullPath: fullPath
 *     file: fileObj
 * }
 *
 * or
 *
 * jsonFileInfo = {
 *     hasJson: false
 * }
 *
 */
function addSameNameFilesInCurrDir(fileFullpath, buildManager) {
    const {dir: currDir, name} = path.parse(fileFullpath);
    if (!__cacheCompFile[currDir]) {
        __cacheCompFile[currDir] = {};
    }
    let cacheFiles = __cacheCompFile[currDir][name];
    let files = [];
    let jsonFileInfo = {hasJson: false};

    if (cacheFiles && cacheFiles.length) {
        files = cacheFiles;

        for (let i = 0, len = files.length; i < len; i++) {
            addFileAndHandleJson(files[i], name, buildManager, jsonFileInfo);
        }
    }
    else {
        files = fs.readdirSync(currDir);

        for (let i = 0, len = files.length; i < len; i++) {
            let file = files[i];
            let fullPath = path.resolve(currDir, file);

            let stat = getFileState(fullPath);

            if (!stat || stat.isDirectory()) {
                continue;
            }
            let fileName = path.parse(fullPath).name;
            if (!__cacheCompFile[currDir][fileName]) {
                __cacheCompFile[currDir][fileName] = [];
            }
            __cacheCompFile[currDir][fileName].push(fullPath);

            addFileAndHandleJson(fullPath, name, buildManager, jsonFileInfo);
        }
    }

    return jsonFileInfo;
}

/**
 * addComponentNpmFiles
 *
 * @param {string}  compFullPath 组件绝对路径
 * @param {Object}  buildManager buildManager
 */
function addComponentNpmFiles(compFullPath, buildManager) {
    if (!compFullPath || !isFileExists(compFullPath)) {
        return;
    }

    let {dir: compFullDir, name: fileName} = path.parse(compFullPath);

    if (__cacheAddedComp[compFullDir + fileName]) {
        return;
    }
    __cacheAddedComp[compFullDir + fileName] = true;

    let jsonFileInfo = addSameNameFilesInCurrDir(compFullPath, buildManager);

    if (!jsonFileInfo.hasJson) {
        return;
    }

    // If is .json need analysis inner usingComponents
    // and change usingComponents option
    let componentConfig = customRequire(jsonFileInfo.fullPath);
    let usingComponents = componentConfig[USING_COMPONENT_KEY];
    if (!usingComponents) {
        return;
    }

    let subCompFullPath = '';
    Object.keys(usingComponents).forEach(k => {
        let value = usingComponents[k];
        if (!value) {
            return;
        }
        subCompFullPath = resolveNpmComp(buildManager, jsonFileInfo.file, value);

        let relativePath = relative(subCompFullPath, compFullDir).replace(/\.\w+$/, '');
        usingComponents[k] = nodeModulesToNpm(relativePath);
        addComponentNpmFiles(subCompFullPath, buildManager);
    });
    jsonFileInfo.file.content = JSON.stringify(componentConfig, null, 4);
}

/**
 * get npm component original fullPath
 *
 * @param  {Object} componentPath release relative path
 * @param  {Object} file file
 * @param  {Object} buildManager buildManager
 * @return {string} fullPath
 */
function getNpmComponentOriginalFullPath(componentPath, file, buildManager) {

    let {files: fileFactory, root: rootDir, buildConf} = buildManager;

    let componentAbsPath = path.resolve(file.dirname, componentPath + '.js');
    let depAbsDir = path.resolve(rootDir, buildConf.output.depDir);

    if (componentAbsPath.includes(depAbsDir)) {
        let relComp = relative(componentAbsPath, rootDir);

        // get npm file original fullpath
        return fileFactory.getNpmFileFullPath(relComp);
    }
    return '';
}

/**
 * analysis npm components
 *
 * @param  {Object} usingComponents  usingComponents config
 * @param  {Object} file            file
 * @param  {Object} buildManager    buildManager
 */
function analysisNpmComponents(usingComponents, file, buildManager) {
    if (!usingComponents) {
        return;
    }

    Object.keys(usingComponents).forEach(k => {

        // local commponent has been handle when compile, just handle npm components
        let componentNpmAbsPath = getNpmComponentOriginalFullPath(usingComponents[k], file, buildManager);
        if (!componentNpmAbsPath) {
            return;
        }

        addComponentNpmFiles(componentNpmAbsPath, buildManager);
    });
}

exports.analysisNpmComponents = analysisNpmComponents;
