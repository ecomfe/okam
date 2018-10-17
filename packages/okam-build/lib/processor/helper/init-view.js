/**
 * @file Component template view transform options initialize
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const path = require('path');
const PLUGIN_BASE_NAME = path.join(__dirname, '..', '..', 'template/transform/plugins');

/**
 * The builtin plugins
 *
 * @const
 * @type {Object}
 */
const BUILTIN_PLUGINS = {
    syntax: {
        wx: path.join(PLUGIN_BASE_NAME, 'wx-syntax-plugin'),
        swan: path.join(PLUGIN_BASE_NAME, 'swan-syntax-plugin')
    },
    html: path.join(PLUGIN_BASE_NAME, 'html-plugin'),
    ref: path.join(PLUGIN_BASE_NAME, 'ref-plugin')
};

/**
 * Add ref plugin
 *
 * @inner
 * @param {Array.<Object>} plugins the existed plugins
 * @return {Array.<Object>}
 */
function addRefPlugin(plugins) {
    let refPlugin = require(BUILTIN_PLUGINS.ref);
    let hasRefPlugin = plugins.some(
        item => (refPlugin === (Array.isArray(item) ? item[0] : item))
    );
    if (!hasRefPlugin) {
        plugins.push(refPlugin);
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
    return plugins.map(item => {
        if (typeof item === 'string') {
            let pluginPath = BUILTIN_PLUGINS[item];
            if (pluginPath && typeof pluginPath === 'object') {
                pluginPath = pluginPath[appType];
            }

            pluginPath && (item = pluginPath);
        }

        let pluginItem;
        if (typeof item === 'string') {
            pluginItem = require(item);
        }

        return pluginItem;
    });
}

/**
 * Initialize component view template transform options.
 *
 * @param {Object} processOpts the process options
 * @param {Array.<string|Object>} processOpts.plugins the view processor plugins,
 *        the builtin plugins:
 *        `syntax`: transform okam template syntax to mini program template syntax
 *        `html`: transform html tags to mini program component tag
 *        `ref`: provide view `ref` attribute support like Vue
 *        You can also pass your custom plugin:
 *        {
 *           tag() {} // refer to the ref plugin implementation
 *        }
 * @param {BuildManager} buildManager the build manager
 * @return {Object}
 */
function initViewTransformOptions(processOpts, buildManager) {
    let isSupportRef = buildManager.isEnableRefSupport();
    let plugins = processOpts.plugins;

    let {appType, componentConf} = buildManager;
    let templateConf = (componentConf && componentConf.template) || {};
    if (!plugins || !plugins.length) {
        plugins = ['syntax'];

        if (templateConf.transformTags) {
            plugins.push('html');
        }
    }

    plugins = normalizeViewPlugins(plugins, appType);
    if (isSupportRef) {
        plugins = addRefPlugin(plugins);
    }

    processOpts.plugins = plugins;

    return Object.assign(
        {},
        processOpts,
        {
            plugins,
            template: templateConf
        }
    );
}

module.exports = exports = initViewTransformOptions;
