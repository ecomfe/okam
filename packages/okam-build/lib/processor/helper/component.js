/**
 * @file Builtin processor helper
 * @author xiaohong8023@outlook.com
 */

'use strict';

const fs = require('fs');
const path = require('path');

const {
    getFileName,
    getFileState,
    relative: getRelative
} = require('../../util').file;

/**
 * The native component file ext names
 *
 * @const
 * @type {Object}
 */
const COMPONENT_FILE_EXT_NAMES = {
    swan: {
        mustFile: ['swan', 'js'],
        originFiles: {
            swan: 'isSwanCompScript',
            css: false,
            json: false,
            js: false
        }
    },
    wx: {
        mustFile: ['wxml', 'js'],
        originFiles: {
            wxml: 'isWxCompScript',
            wxss: false,
            json: false,
            js: false
        }
    },
    quick: {
        mustFile: ['ux'],
        originFiles: {
            // not support quick script
            ux: false
        }
    },
    ant: {
        mustFile: ['axml', 'js'],
        originFiles: {
            axml: 'isAntCompScript',
            acss: false,
            json: false,
            js: false
        }
    },
    tt: {
        mustFile: ['ttml', 'js'],
        originFiles: {
            ttml: 'isTTCompScript',
            ttss: false,
            json: false,
            js: false
        }
    },
    wx2swan: {
        mustFile: ['wxml', 'js'],
        originFiles: {
            wxml: 'isWxCompScript',
            wxss: false,
            json: false,
            js: false
        }
    }
};

/**
 * Initialize the file list information in the given directory.
 * Return the file info structure:
 * {
 *    'fileName1': ['fullPath11', 'fullPath12'],
 *    'fileName2': ['fullPath21', 'fullPath22']'
 * }
 *
 * e.g., the dir `/test/src` has files: `/test/src/a.js`, `/test/src/a.css`
 * then response:
 * {
 *     'a': ['/test/src/a.js', '/test/src/a.css']
 * }
 *
 * @inner
 * @param {string} dir the directory to init
 * @param {CacheManager} cache the cache manager
 * @return {Object}
 */
function initDirFiles(dir, cache) {
    let cacheDirFiles = {};
    cache.setDirFileListInfo(dir, cacheDirFiles);

    let files = fs.readdirSync(dir);
    for (let i = 0, len = files.length; i < len; i++) {
        let file = files[i];
        let fullPath = path.resolve(dir, file);

        let stat = getFileState(fullPath);
        if (!stat || stat.isDirectory()) {
            continue;
        }

        let fileName = getFileName(fullPath);
        let fileList = cacheDirFiles[fileName];
        if (!fileList) {
            fileList = cacheDirFiles[fileName] = [];
        }
        fileList.push(fullPath);
    }

    return cacheDirFiles;
}

function isFileInSourceDir(filePath, sourceDir) {
    let newPath = filePath.replace(/\\/g, '/');
    return newPath.indexOf(sourceDir + '/') === 0;
}

function isCompFileExists(filePath, compileContext) {
    // in source
    if (isFileInSourceDir(filePath, compileContext.sourceDir)) {
        return compileContext.getFileByFullPath(filePath);
    }

    let cache = compileContext.cache;
    let currDir = path.dirname(filePath);
    let cacheDirFiles = cache.getDirFileListInfo(currDir);

    if (!cacheDirFiles) {
        cacheDirFiles = initDirFiles(currDir, cache);
    }
    const fileName = getFileName(filePath);
    let sameNameFiles = cacheDirFiles[fileName];
    return sameNameFiles.indexOf(filePath) >= 0;
}

/**
 * 获取原生(页面、自定义)组件的相关文件信息内容
 *
 * @param {string} type  COMPONENT_FILE_EXT_NAMES key
 * @param {string} filePathNoExtname 无后缀名的文件路径
 * @param {Object} options options
 * @return {Object}
 * {
 *      component 类型
 *      componentType,
 *      // 对应原生缺失的必要文件的后缀名
 *      missingMustFileExtnames,
 *      // 后缀名: 文件完整路径 {extname: fullPath}
 *      fileExtnameMap
 *  }
 */
function getCompOriginFileInfoByType(type, filePathNoExtname, options) {

    const componentExtMap = COMPONENT_FILE_EXT_NAMES[type] || {};

    // handle native file
    let componentType;
    let missingMustFileExtnames = [];
    let fileExtnameMap = {};

    Object.keys(componentExtMap.originFiles || {}).forEach(k => {
        let filePath = `${filePathNoExtname}.${k}`;
        if (!isCompFileExists(filePath, options.compileContext)) {
            return;
        }

        let flagKey = componentExtMap.originFiles[k];
        if (typeof flagKey === 'string') {
            // add flag for native component script
            componentType = flagKey;
        }

        fileExtnameMap[k] = filePath;
    });

    (componentExtMap.mustFile || []).forEach(fileExt => {
        if (!fileExtnameMap.hasOwnProperty(fileExt)) {
            missingMustFileExtnames.push(fileExt);
        }
    });

    return {
        componentType,
        missingMustFileExtnames,
        fileExtnameMap
    };
}

/**
 * 根据 appType 获取对应的组件信息
 *
 * @param {string} filePathNoExtname 无后缀名的文件路径
 * @param {Object} options options
 * @return {Object}
 * {
 *      component 类型
 *      componentType,
 *      // 对应原生缺失的必要文件的后缀名
 *      missingMustFileExtnames,
 *      // 后缀名: 文件完整路径 {extname: fullPath}
 *      fileExtnameMap
 * }
 */
function getCompFilesInfoByAppType(filePathNoExtname, options) {
    let {appType, wx2swan, componentExtname} = options;

    // sfc
    let filePath = `${filePathNoExtname}.${componentExtname}`;
    if (isCompFileExists(filePath, options.compileContext)) {
        return {
            missingMustFileExtnames: [],
            fileExtnameMap: {
                [componentExtname]: filePath
            }
        };
    }

    let result = getCompOriginFileInfoByType(appType, filePathNoExtname, options);

    if (!result.missingMustFileExtnames.length) {
        return result;
    }

    if (appType === 'swan' && wx2swan) {
        result = getCompOriginFileInfoByType('wx2swan', filePathNoExtname, options);

        if (!result.missingMustFileExtnames.length) {
            return result;
        }
    }

    result.missingMustFileExtnames = [componentExtname];
    return result;
}

/**
 * 根据类型 获取页面原生文件后缀名，以及相应的错误提示
 *
 * @param  {string} pageFileNotExt  page file no extname
 * @param  {Object} buildManager      build
 * @return {Object}                {missingMustFileExtnames, filesMap}
 * {
 *      // 对应原生缺失的必要文件的后缀名
 *      missingMustFileExtnames,
 *      // 后缀名: 文件对象 {extname: fileObject}
 *      filesMap
 * }
 */
function getPageOriginFileExtnames(pageFileNotExt, buildManager) {
    let {files: allFiles, appType, buildConf, componentExtname} = buildManager;

    // handle native file
    let compFilesInfo = getCompFilesInfoByAppType(pageFileNotExt, {
        appType,
        wx2swan: buildConf.wx2swan,
        componentExtname,
        compileContext: buildManager.compileContext
    });

    let filesMap = {};
    let {componentType, missingMustFileExtnames, fileExtnameMap} = compFilesInfo;

    Object.keys(fileExtnameMap || {}).forEach(k => {
        let pageFile = allFiles.getByFullPath(fileExtnameMap[k]);
        if (!pageFile) {
            return;
        }
        filesMap[k] = pageFile;
    });

    // all must have js script except quick
    let scriptFile = filesMap.js;
    if (componentType && scriptFile) {
        scriptFile[componentType] = true;
    }

    let jsonFile = filesMap.json;
    if (jsonFile) {
        jsonFile.isComponentConfig = true;
        jsonFile.component = scriptFile;
    }

    return {
        missingMustFileExtnames,
        filesMap
    };
}


/**
 * addProcessEntryPages
 *
 * @param {Array} pages        pages
 * @param {Object} pageFileMap  page file map
 * @param {Array} allPageFiles  all page files
 * @param {Object} fileDirname         file object
 * @param {Object} buildManager buildManager
 */
function addProcessEntryPages(pages, pageFileMap, allPageFiles, fileDirname, buildManager) {
    let {files: allFiles, componentExtname, logger, appType, root} = buildManager;

    pages.forEach(
        p => {
            let pageFileNotExt = path.resolve(fileDirname, p);
            let pageFile = allFiles.getByFullPath(`${pageFileNotExt}.${componentExtname}`);

            // add sfc first
            if (pageFile) {
                pageFileMap[p] = pageFile;
                pageFile.isPageComponent = true;
                buildManager.addNeedBuildFile(pageFile);
                allPageFiles.push(pageFile);
                return;
            }

            // not support quick
            if (appType === 'quick') {
                logger.error(`missing page file: 「${pageFileNotExt}.${componentExtname}」.`);
                return;
            }

            // add native file
            let resultFilesInfo = getPageOriginFileExtnames(pageFileNotExt, buildManager);

            Object.keys(resultFilesInfo.filesMap || {}).forEach(ext => {
                let originFile = resultFilesInfo.filesMap[ext];
                buildManager.addNeedBuildFile(originFile);
                allPageFiles.push(originFile);
            });

            let missingMustFileExtnames = resultFilesInfo.missingMustFileExtnames;
            if (missingMustFileExtnames.length) {
                let pageFile = getRelative(pageFileNotExt, root);
                missingMustFileExtnames.forEach(ext => {
                    logger.error(`missing page file: 「${pageFile}.${ext}」.`);
                });
            }

        }
    );
}

module.exports = exports = {
    getCompFilesInfoByAppType,
    initDirFiles,
    isFileInSourceDir,
    addProcessEntryPages,
    COMPONENT_FILE_EXT_NAMES
};

