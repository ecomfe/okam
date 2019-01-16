/**
 * @file Babel processor option initialize
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const {resolve: resolveDep} = require('./npm');
const programPlugins = require('../js/plugins/babel-program-plugins');
const polyfillPlugin = require('../js/plugins/babel-polyfill-plugins');
const {normalPageConfig, normalizeComponentConfig} = require('./config');

const DEP_PLUGIN_NAME = 'dep';

/**
 * The builtin babel plugins
 *
 * @const
 * @type {Object}
 */
const BUILTIN_PLUGINS = {
    [DEP_PLUGIN_NAME]: function (file, buildManager) {
        return [
            programPlugins.resolveDep,
            {
                resolveDepRequireId: resolveDep.bind(null, buildManager, file)
            }
        ];
    }
};

/**
 * Initialize the mixin(Behavior) file
 *
 * @inner
 * @param {Array.<string>} mixins the mixin file paths
 * @param {Object} buildManager the build manager
 * @param {Object} file the file that refers the mixin files
 */
function initMixinFile(mixins, buildManager, file) {
    mixins && mixins.forEach(modulePath => {
        let moduleFullPath = buildManager.resolve(
            modulePath, file
        );
        let mixinFile = moduleFullPath && buildManager.getFileByFullPath(moduleFullPath);
        if (mixinFile && !mixinFile.isBehavior) {
            mixinFile.isBehavior = true;
        }
    });
}

/**
 * Initialize filter config
 *
 * @param {Object} filters filter info
 * @param {Object} buildManager the build manager
 * @param {Object} file the file that owns the filter
 */
function initFilterConfig(filters, buildManager, file) {
    if (!filters) {
        return;
    }
    file.filters = filters;
}

/**
 * Initialize the app/component/page config information.
 * e.g., the `mixins` info defined in the component, the `config` defined in
 * app entry script that will be extracted to `app.json`
 *
 * @inner
 * @param {BuildManager} buildManager the build manager
 * @param {string} key the cache key that the `config` info cached to the file
 * @param {Object} file the file contains the config info
 * @param {Object} info the extract config info
 */
function initConfigInfo(buildManager, key, file, info) {
    buildManager.logger.trace('extract file config', file.path, info);
    let {components, config = {}} = info;

    if (file.isPageScript) {
        initMixinFile(info.mixins, buildManager, file);
        initFilterConfig(info.filters, buildManager, file);
        config = normalPageConfig(config, components, file, buildManager);
    }
    else if (file.isComponentScript) {
        initMixinFile(info.mixins, buildManager, file);
        initFilterConfig(info.filters, buildManager, file);
        config = normalizeComponentConfig(config, components, file, buildManager);
        config.component = true;
    }
    else {
        initMixinFile(info.mixins, buildManager, file);
    }

    file[key] = config;
}

/**
 * Initialize the local polyfill plugins
 *
 * @inner
 * @param {Array.<Object>} polyfills the polyfill list
 * @param {Array} plugins the existed plugin list
 */
function initLocalPolyfillPlugins(polyfills, plugins) {
    polyfills.forEach(item => {
        let pluginItem = polyfillPlugin[item.type];
        plugins.push([
            pluginItem, {polyfill: item}
        ]);
    });
}

/**
 * Check whether has babel dep resolve plugin in the given plugin list
 *
 * @inner
 * @param {Array} plugins the plugin list
 * @return {boolean}
 */
function hasBabelDepPlugin(plugins) {
    return plugins.some(item => {
        let pluginItem = item;
        if (Array.isArray(item)) {
            pluginItem = item[0];
        }

        if (typeof pluginItem === 'string') {
            return pluginItem === DEP_PLUGIN_NAME;
        }

        return pluginItem === programPlugins.resolveDep;
    });
}

/**
 * Normalize babel plugins
 *
 * @inner
 * @param {Array} plugins the plugins to normalize
 * @param {Object} file the file to process
 * @param {BuildManager} buildManager the build manager
 * @return {Array}
 */
function normalizeBabelPlugins(plugins, file, buildManager) {
    if (typeof plugins === 'function') {
        plugins = plugins(file);
    }

    plugins = plugins ? [].concat(plugins) : [];
    if (!hasBabelDepPlugin(plugins)) {
        // add npm resolve plugin
        plugins.push(DEP_PLUGIN_NAME);
    }

    return (plugins || []).map(item => {
        if (typeof item === 'string') {
            let result = BUILTIN_PLUGINS[item];
            if (typeof result === 'function') {
                return result(file, buildManager);
            }
        }
        return item;
    });
}

/**
 * Initialize babel processor options
 *
 * @param {Object} file the file to process
 * @param {Object} processorOpts the processor options
 * @param {BuildManager} buildManager the build manager
 * @return {Object}
 */
function initBabelProcessorOptions(file, processorOpts, buildManager) {
    processorOpts = Object.assign(
        {}, buildManager.babelConfig, processorOpts
    );

    // init plugins
    let plugins = normalizeBabelPlugins(processorOpts.plugins, file, buildManager);

    // init app/page/component transform plugin
    let configInitHandler = initConfigInfo.bind(
        null, buildManager, 'config', file
    );
    let appBaseClass = buildManager.getOutputAppBaseClass();
    let pluginOpts = {
        appType: buildManager.appType,
        config: configInitHandler
    };
    let filterOptions = buildManager.getFilterTransformOptions();
    let enableMixinSupport = buildManager.isEnableMixinSupport();
    let {api, framework, localPolyfill, polyfill} = buildManager.buildConf;
    let getInitOptions = buildManager.getAppBaseClassInitOptions.bind(
        buildManager, file
    );
    if (file.isEntryScript) {
        Object.assign(pluginOpts, {
            framework,
            registerApi: api,
            baseClass: appBaseClass && appBaseClass.app
        });
        // polyfill using local variable is prior to global polyfill
        localPolyfill || (pluginOpts.polyfill = polyfill);
        pluginOpts.getInitOptions = getInitOptions;
        plugins.push([
            programPlugins.app,
            pluginOpts
        ]);
    }
    else if (file.isPageScript) {
        Object.assign(pluginOpts, {
            enableMixinSupport,
            filterOptions,
            tplRefs: file.tplRefs,
            baseClass: appBaseClass && appBaseClass.page,
            getInitOptions
        });
        plugins.push([programPlugins.page, pluginOpts]);
    }
    else if (file.isComponentScript) {
        Object.assign(pluginOpts, {
            enableMixinSupport,
            filterOptions,
            tplRefs: file.tplRefs,
            baseClass: appBaseClass && appBaseClass.component,
            getInitOptions
        });
        plugins.push([programPlugins.component, pluginOpts]);
    }
    else if (file.isBehavior) {
        plugins.push([programPlugins.behavior, pluginOpts]);
    }

    // init local polyfill plugins
    if (localPolyfill && !file.compiled) {
        initLocalPolyfillPlugins(localPolyfill, plugins);
    }

    processorOpts.plugins = plugins;

    return processorOpts;
}

module.exports = exports = initBabelProcessorOptions;
