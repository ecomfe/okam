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
 * Get script babel transform plugin
 *
 * @inner
 * @param {Object} pluginOpts the default init plugin transform options
 * @param {Object} file the file to transform
 * @param {BuildManager} buildManager the build manager
 * @param {string} type the script type
 * @return {Array}
 */
function getTransformPlugin(pluginOpts, file, buildManager, type) {
    const appBaseClass = buildManager.getOutputAppBaseClass();
    const getInitOptions = buildManager.getAppBaseClassInitOptions.bind(
        buildManager, file
    );
    const {api, framework, localPolyfill, polyfill} = buildManager.buildConf;

    let customOpts;
    if (type === 'app') {
        customOpts = {
            framework,
            registerApi: api,
            baseClass: appBaseClass && appBaseClass.app,
            routeConfigModId: buildManager.getAppRouterModuleId(),
            getInitOptions
        };

        // polyfill using local variable is prior to global polyfill
        localPolyfill || (customOpts.polyfill = polyfill);
    }
    else {
        const isVue = buildManager.isNativeSupportVue();
        customOpts = {
            filterOptions: buildManager.getFilterTransformOptions(),
            tplRefs: file.tplRefs,
            baseClass: appBaseClass && appBaseClass[type],
            getInitOptions,
            keepComponentsProp: isVue,
            dataPropValueToFunc: isVue
        };
    }

    return [
        programPlugins[type],
        Object.assign({}, pluginOpts, customOpts)
    ];
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
    if (file.noTransform || (file.owner && file.owner.noTransform)) {
        processorOpts = Object.assign({}, processorOpts);
        processorOpts.ignoreDefaultOptions = true;
        processorOpts.plugins = ['dep'];
    }

    processorOpts = Object.assign(
        {}, buildManager.babelConfig, processorOpts
    );

    // init plugins
    let plugins = processorOpts.plugins || [];
    if (typeof plugins === 'function') {
        plugins = plugins(file) || [];
        Array.isArray(plugins) || (plugins = [plugins]);
    }

    if (processorOpts.ignoreDefaultOptions) {
        delete processorOpts.ignoreDefaultOptions;
        processorOpts.plugins = normalizeBabelPlugins(
            plugins, file, buildManager
        );
        return processorOpts;
    }

    if (!hasBabelDepPlugin(plugins)) {
        // add npm resolve plugin
        plugins.push(DEP_PLUGIN_NAME);
    }

    plugins = normalizeBabelPlugins(
        plugins, file, buildManager
    );

    // init app/page/component transform plugin
    let configInitHandler = initConfigInfo.bind(
        null, buildManager, 'config', file
    );
    let pluginOpts = {
        appType: buildManager.appType,
        config: configInitHandler,
        enableMixinSupport: buildManager.isEnableMixinSupport()
    };
    let {localPolyfill} = buildManager.buildConf;
    if (file.isEntryScript) {
        plugins.push(getTransformPlugin(
            pluginOpts, file, buildManager, 'app'
        ));
    }
    else if (file.isPageScript) {
        plugins.push(getTransformPlugin(
            pluginOpts, file, buildManager, 'page'
        ));
    }
    else if (file.isComponentScript) {
        plugins.push(getTransformPlugin(
            pluginOpts, file, buildManager, 'component'
        ));
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
