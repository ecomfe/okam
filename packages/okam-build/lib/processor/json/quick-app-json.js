/**
 * @file The quick app json processor
 * @author sparklewhy@gmail.com
 */

'use strict';

const relative = require('../../util').file.relative;

/**
 * Get the router page information
 *
 * @inner
 * @param {string} pagePath the page path
 * @param {string=} prefix the page name prefix, optional
 * @return {{pageName: string, componentName: string}}
 */
function getPageInfo(pagePath, prefix) {
    let parts = pagePath.split('/');
    let componentName = parts.pop();
    let pageName = parts.join('/');

    prefix && (pageName = `${prefix}/${pageName}`);
    return {
        pageName,
        componentName
    };
}

/**
 * Normalize router page information
 *
 * @inner
 * @param {Object} result the existed router pages
 * @param {Array} pages the router pages to normalize
 * @param {string=} prefix the page name prefix, optional
 * @return {string} return the entry page name
 */
function normalizePages(result, pages, prefix) {
    let entryPageName;
    pages.forEach((item, idx) => {
        let filter;
        if (typeof item === 'object') {
            let {path, filter: pageFilter} = item;
            item = path;
            filter = pageFilter;
        }

        let {pageName, componentName} = getPageInfo(item, prefix);
        let pageInfo = {
            component: componentName
        };
        filter && (pageInfo.filter = filter);
        result[pageName] = pageInfo;
        if (idx === 0) {
            entryPageName = pageName;
        }
    });

    return entryPageName;
}

/**
 * Normalize app route info
 *
 * @inner
 * @param {Array.<string>} pages the page path list
 * @param {Array.<Object>=} subPackages the sub packages, optional
 * @return {Object}
 */
function normalizeRouteInfo(pages, subPackages) {
    let result = {};
    let entryPageName = normalizePages(result, pages);

    subPackages && subPackages.forEach(item => {
        let {root, pages: subPages} = item;
        normalizePages(result, subPages, root);
    });

    return {
        entry: entryPageName,
        pages: result
    };
}

/**
 * Normalize display page information
 * input:
 * {
 *    '<pagePath>': pageInfo
 * }
 * output:
 * {
 *    '<pageName>': pageInfo
 * }
 *
 * @inner
 * @param {Object} pages the display pages information to normalize
 * @return {Object}
 */
function normalizeDisplayPages(pages) {
    if (!pages) {
        return;
    }

    let result = {};
    Object.keys(pages).forEach(k => {
        let item = pages[k];
        let {pageName} = getPageInfo(k);
        result[pageName] = item;
    });

    return result;
}

/**
 * The page component config item name map
 * The key is the config name used in weixin mini program
 * The value is the config name used in quick app.
 *
 * @const
 * @type {Object}
 */
const DISPLAY_PAGE_CONFIG_MAP = {
    backgroundColor: 'backgroundColor',
    fullScreen: 'fullScreen',
    titleBar: 'titleBar',
    navigationBarBackgroundColor: 'titleBarBackgroundColor',
    navigationBarTextStyle: 'titleBarTextColor',
    navigationBarTitleText: 'titleBarText',
    menu: 'menu'
};

/**
 * Add display page config info based the config defined in page
 *
 * @inner
 * @param {Object} pages the existed display page config
 * @param {string} sourceDir the project source directory
 * @param {Object} configFile the config file
 */
function addDisplayPageConfig(pages, sourceDir, configFile) {
    let path = relative(configFile.fullPath, sourceDir);
    let {pageName} = getPageInfo(path);
    let currPageDisplayInfo = pages[pageName];
    let pageConfig = JSON.parse(configFile.content);

    let result = {};
    // filter the illegal not supported config item
    // and map the weixin config name to quick app
    Object.keys(pageConfig).forEach(k => {
        let newKey = DISPLAY_PAGE_CONFIG_MAP[k];
        if (newKey) {
            result[newKey] = pageConfig[k];
        }
    });

    // merge the page config, the config defined in page has higher priority
    // than the app config
    pages[pageName] = Object.assign({}, currPageDisplayInfo, result);
}

/**
 * Normalize window config, convert it as quick app display config
 *
 * @inner
 * @param {?Object} windowConfig the window config
 * @return {?Object}
 */
function normalizeWindowConfig(windowConfig) {
    if (!windowConfig) {
        return;
    }

    let result = {};
    // filter the illegal not supported config item
    // and map the weixin config name to quick app
    Object.keys(windowConfig).forEach(k => {
        let newKey = DISPLAY_PAGE_CONFIG_MAP[k];
        if (newKey) {
            result[newKey] = windowConfig[k];
        }
    });
    return result;
}

/**
 * Add API feature item.
 * Return the feature item to add, or return false if existed.
 *
 * @inner
 * @param {Object} logger logger the logger utilities
 * @param {Object} existed the added feature item map
 * @param {string} name the feature item name to add
 * @param {Object=} params the feature item params, optional
 * @return {Object|boolean}
 */
function addFeatureItem(logger, existed, name, params) {
    if (!existed[name]) {
        existed[name] = true;
        let feature = {name};
        params && (feature.params = params);
        return feature;
    }

    logger.debug('duplicated feature declaration', name);
    return false;
}

/**
 * Normalize API feature item
 *
 * @inner
 * @param {*} item the feature item to normalize
 * @param {Object} existed the added feature item map
 * @param {Array.<Object>} result the normalized feature items result
 * @param {Object} logger logger the logger utilities
 */
function normalizeFeatureItem(item, existed, result, logger) {
    let addItem;
    if (typeof item === 'string') {
        addItem = addFeatureItem(logger, existed, item);
    }
    else if (Array.isArray(item)) {
        let [name, params] = item;
        addItem = addFeatureItem(logger, existed, name, params);
    }
    else if (item && typeof item === 'object') {
        let {name, params} = item;
        addItem = addFeatureItem(logger, existed, name, params);
    }

    if (addItem) {
        result.push(addItem);
    }
}

/**
 * Get used API feature declarations
 * Support the following format feature input:
 * [
 *   'system.xxx',
 *   ['system.abc', {a: 3}],
 *   {name: 'xx', params: {bb: 33}}
 * ]
 *
 * output:
 * [
 *   {name: 'system.xxx'},
 *   {name: 'system.abc', params: {a: 3}},
 *   {name: 'xx', params: {bb: 33}}
 * ]
 *
 * @inner
 * @param {Array} features the existed features
 * @param {Object} options the processor options
 * @return {?Array.<Object>}
 */
function getUsedAPIFeatures(features, options) {
    let {
        logger,
        getAllUsedAPIFeatures
    } = options;
    let result = [];
    let existed = {};
    features && features.forEach(
        item => normalizeFeatureItem(item, existed, result, logger)
    );

    let usedFeatures = getAllUsedAPIFeatures();
    usedFeatures && usedFeatures.forEach(item => {
        // remove feature name leading character `@`
        item = item.substr(1);
        normalizeFeatureItem(item, existed, result, logger);
    });

    return result.length ? result : null;
}

/**
 * Normalize debug config
 * input:
 * {
 *   debug: true
 * }
 *
 * after normalize:
 * {
 *   config: {
 *      logLevel: 'debug'
 *   }
 * }
 *
 * @param {Object} info the app config info
 */
function normalizeDebugConfig(info) {
    if (info.hasOwnProperty('debug')) {
        let debug = info.debug;
        delete info.debug;

        let value = debug ? 'debug' : 'off';
        let config = info.config;
        if (!config) {
            info.config = {
                logLevel: value
            };
        }
        else if (!config.logLevel) {
            config.logLevel = value;
        }
    }
}

/**
 * Compile quick app json, it should compile after all files build done
 *
 * @param {Object} file the file to process
 * @param {Object} options the compile options
 * @return {{content: string}}
 */
function compile(file, options) {
    if (!file.compileReady && !file.owner.processed) {
        return {content: file.content};
    }

    let {
        getAllPageConfigFiles,
        sourceDir,
        designWidth
    } = options;
    let obj = JSON.parse(file.content.toString());

    // normalize router info
    let routerInfo = normalizeRouteInfo(obj.pages);
    delete obj.pages;
    obj.router = routerInfo;

    // normalize debug info
    normalizeDebugConfig(obj);

    // init designWidth
    if (designWidth) {
        obj.config || (obj.config = {});
        if (!obj.config.designWidth) {
            obj.config.designWidth = designWidth;
        }
    }

    // normalize window config info
    let displayInfo = obj.display;
    let displayConfig = normalizeWindowConfig(obj.window);
    // the display config has higher priority than window config
    displayConfig && (displayInfo = Object.assign(displayConfig, displayInfo));
    displayInfo && (obj.display = displayInfo);
    delete obj.window;

    // normalize display pages info
    if (displayInfo && displayInfo.pages) {
        displayInfo.pages = normalizeDisplayPages(displayInfo.pages);
    }

    // normalize features
    let features = getUsedAPIFeatures(obj.features, options);
    features && (obj.features = features);

    // merge the page display config defined in page
    let pageConfigFiles = getAllPageConfigFiles();
    let currDisplayPages = (displayInfo && displayInfo.pages) || {};
    pageConfigFiles.forEach(item => {
        addDisplayPageConfig(currDisplayPages, sourceDir, item);
    });
    if (Object.keys(currDisplayPages).length) {
        displayInfo || (obj.display = {});
        obj.display.pages = currDisplayPages;
    }

    return {
        content: JSON.stringify(obj, null, 4)
    };
}

module.exports = exports = compile;

