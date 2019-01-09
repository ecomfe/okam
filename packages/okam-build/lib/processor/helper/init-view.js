/**
 * @file Component template view transform options initialize
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const path = require('path');
const PLUGIN_BASE_NAME = path.join(__dirname, '..', 'template/plugins');

/**
 * Get event syntax transformation plugin
 *
 * @param {string} appType the app type to transform
 * @return {string}
 */
function getEventSyntaxPlugin(appType) {
    return path.join(PLUGIN_BASE_NAME, 'event', `${appType}-event-plugin`);
}

/**
 * Get filter syntax transformation plugin
 *
 * @param {string} appType the app type to transform
 * @return {string}
 */
function getFilterSyntaxPlugin(appType) {
    return path.join(PLUGIN_BASE_NAME, 'filter', `${appType}-filter-plugin`);
}

/**
 * Get model syntax transformation plugin
 *
 * @param {string} appType the app type to transform
 * @return {string}
 */
function getModelSyntaxPlugin(appType) {
    return path.join(PLUGIN_BASE_NAME, 'model', `${appType}-model-plugin`);
}

/**
 * Get template syntax transformation plugin
 *
 * @inner
 * @param {string} appType the app type to transform
 * @return {string}
 */
function getTemplateSyntaxPlugin(appType) {
    return path.join(PLUGIN_BASE_NAME, `${appType}-syntax-plugin`);
}

const REF_PLUGIN_PATH = path.join(PLUGIN_BASE_NAME, 'ref-plugin');

/**
 * The builtin plugins
 *
 * @const
 * @type {Object}
 */
const BUILTIN_PLUGINS = {
    syntax: getTemplateSyntaxPlugin,
    eventSync: getEventSyntaxPlugin,
    model: getModelSyntaxPlugin,
    tagTransform: path.join(PLUGIN_BASE_NAME, 'tag-transform-plugin'),
    vuePrefix: path.join(PLUGIN_BASE_NAME, 'vue-prefix-plugin'),
    ref: {
        quick: [
            REF_PLUGIN_PATH, {useId: true}
        ],
        default: [REF_PLUGIN_PATH]
    }
};


/**
 * Add ref plugin
 *
 * @inner
 * @param {string} appType the app type to transform
 * @param {Array.<Object>} plugins the existed plugins
 * @return {Array.<Object>}
 */
function addRefPlugin(appType, plugins) {
    let refPluginInfo = BUILTIN_PLUGINS.ref[appType] || BUILTIN_PLUGINS.ref.default;
    let refPlugin = require(refPluginInfo[0]);
    let hasRefPlugin = plugins.some(
        item => (refPlugin === (Array.isArray(item) ? item[0] : item))
    );
    if (!hasRefPlugin) {
        plugins.push([refPlugin, refPluginInfo[1]]);
    }

    return plugins;
}

/**
 * Normalize the view transformation plugins
 *
 * @inner
 * @param {Array.<string|Object>} plugins the plugins to normalize
 * @param {string} appType the appType to transform
 * @return {Array.<Object>}
 */
function normalizeViewPlugins(plugins, appType) {
    return plugins.map(pluginInfo => {
        let pluginItem = pluginInfo;
        let pluginOptions;
        if (Array.isArray(pluginInfo)) {
            pluginItem = pluginInfo[0];
            pluginOptions = pluginInfo[1];
        }

        if (typeof pluginItem === 'string') {
            let pluginPath = BUILTIN_PLUGINS[pluginItem];
            if (typeof pluginPath === 'function') {
                pluginPath = pluginPath(appType);
            }
            else if (pluginPath && typeof pluginPath === 'object') {
                pluginPath = pluginPath[appType] || pluginPath.default;
            }

            if (pluginPath && Array.isArray(pluginPath)) {
                pluginOptions = pluginPath[1];
                pluginPath = pluginPath[0];
            }

            pluginPath && (pluginItem = pluginPath);
        }

        if (typeof pluginItem === 'string') {
            pluginItem = require(pluginItem);
        }

        return pluginOptions ? [pluginItem, pluginOptions] : pluginItem;
    });
}

/**
 * On tag handler
 *
 * @inner
 * @param {Object} file the template file
 * @param {string} tagName the tag name to encounter
 * @param {string=} replaceTagName the old tag name to replace
 */
function handleOnTag(file, tagName, replaceTagName) {
    let tags = file.tags;
    tags || (tags = file.tags = {});
    if (replaceTagName && tags.hasOwnProperty(replaceTagName)) {
        delete tags[replaceTagName];
    }

    tags[tagName] = true;
}

/**
 * On filter handler
 *
 * @inner
 * @param {Object} file the template file
 * @param {string} filterName the filter name
 */
function handleOnFilter(file, filterName) {
    let usedFilters = file.filters;
    usedFilters || (usedFilters = file.filters = []);
    if (!usedFilters.includes(filterName)) {
        usedFilters.push(filterName);
    }
}

/**
 * Initialize component view template transform options.
 *
 * @param {Object} file the file to process
 * @param {Object} processOpts the process options
 * @param {Array.<string|Object>} processOpts.plugins the view processor plugins,
 *        the builtin plugins:
 *        `syntax`: transform okam template syntax to mini program template syntax
 *        `tagTransform`: transform tags A to tag B
 *        `ref`: provide view `ref` attribute support like Vue
 *        You can also pass your custom plugin:
 *        {
 *           tag() {} // refer to the ref plugin implementation
 *        }
 * @param {BuildManager} buildManager the build manager
 * @return {Object}
 */
function initViewTransformOptions(file, processOpts, buildManager) {
    let isSupportRef = buildManager.isEnableRefSupport();
    let isSupportModel = buildManager.isEnableModelSupport();
    let plugins = processOpts.plugins;

    let {appType, componentConf, buildConf} = buildManager;

    let framework = buildConf.framework || [];
    let templateConf = (componentConf && componentConf.template) || {};
    if (!plugins || !plugins.length) {
        plugins = ['syntax'];

        if (templateConf.transformTags) {
            plugins.push('tagTransform');
        }

        // vuePrefix  需要在第一位，v- directives 处理成 directives 再处理
        if (templateConf.useVuePrefix) {
            plugins.unshift('vuePrefix');
        }
    }

    if (isSupportRef) {
        plugins.push('model');
    }

    plugins = normalizeViewPlugins(plugins, appType);
    if (isSupportRef) {
        plugins = addRefPlugin(appType, plugins);
    }

    processOpts.plugins = plugins;

    let filterOptions = buildManager.getFilterTransformOptions();
    if (filterOptions) {
        filterOptions = Object.assign({
            onFilter: handleOnFilter.bind(null, file)
        }, filterOptions);
    }

    return Object.assign(
        {},
        processOpts,
        {
            framework,
            plugins,
            filter: filterOptions,
            template: templateConf,
            onTag: handleOnTag.bind(null, file)
        }
    );
}

module.exports = exports = initViewTransformOptions;

exports.getEventSyntaxPlugin = getEventSyntaxPlugin;
exports.getFilterSyntaxPlugin = getFilterSyntaxPlugin;
