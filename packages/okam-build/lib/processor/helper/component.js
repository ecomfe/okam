/**
 * @file Builtin processor helper
 * @author xiaohong8023@outlook.com
 */

'use strict';

const path = require('path');

/**
 * The native component file ext names
 *
 * @const
 * @type {Object}
 */
const COMPONENT_FILE_EXT_NAMES = {
    swan: {
        swan: 'isSwanCompScript',
        css: false,
        json: false,
        js: false
    },
    wx: {
        wxml: 'isWxCompScript',
        wxss: false,
        json: false,
        js: false
    },
    quick: {
        // not support quick script
        ux: false
    },
    ant: {
        axml: 'isAntCompScript',
        acss: false,
        json: false,
        js: false
    },
    tt: {
        ttml: 'isTTCompScript',
        ttss: false,
        json: false,
        js: false
    }
};

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
    let {files: allFiles, componentExtname, appType} = buildManager;
    let fileExtNames = COMPONENT_FILE_EXT_NAMES[appType] || {};

    pages.forEach(
        p => {
            let pageDir = path.resolve(fileDirname, p);
            let pageFile = allFiles.getByFullPath(`${pageDir}.${componentExtname}`);

            // sfc first
            if (pageFile) {
                pageFileMap[p] = pageFile;
                pageFile.isPageComponent = true;
                buildManager.addNeedBuildFile(pageFile);
                allPageFiles.push(pageFile);
                return;
            }

            // not support quick
            if (appType === 'quick') {
                return;
            }

            // handle native file
            let pageScriptFile = allFiles.getByFullPath(`${pageDir}.js`);
            let pageType;

            Object.keys(fileExtNames).forEach(k => {
                pageFile = allFiles.getByFullPath(`${pageDir}.${k}`);
                if (!pageFile) {
                    return;
                }

                let flagKey = fileExtNames[k];
                if (typeof flagKey === 'string') {
                    // add flag for native component script
                    pageType = flagKey;
                }

                if (k === 'json') {
                    pageFile.isComponentConfig = true;
                    pageFile.component = pageScriptFile;
                }

                buildManager.addNeedBuildFile(pageFile);
                allPageFiles.push(pageFile);
            });

            pageType && pageScriptFile && (pageScriptFile[pageType] = true);
        }
    );
}

module.exports = exports = {
    addProcessEntryPages,
    COMPONENT_FILE_EXT_NAMES
};

