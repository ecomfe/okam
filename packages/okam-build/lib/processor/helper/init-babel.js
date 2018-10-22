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
            mixinFile.compiled && buildManager.addNeedRecompileFile(mixinFile);
        }
    });
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
        config = normalPageConfig(config, components, file, buildManager);
    }
    else if (file.isComponentScript) {
        initMixinFile(info.mixins, buildManager, file);
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
    let plugins = processorOpts.plugins;
    if (typeof plugins === 'function') {
        plugins = plugins(file);
    }
    plugins = [].concat(plugins || []);

    // add npm resolve plugin
    let depResolve = [
        programPlugins.resolveDep,
        {
            resolveDepRequireId: resolveDep.bind(null, buildManager, file)
        }
    ];
    plugins.push(depResolve);

    // init app/page/component transform plugin
    let configInitHandler = initConfigInfo.bind(
        null, buildManager, 'config', file
    );
    let pluginOpts = {
        appType: buildManager.appType,
        config: configInitHandler
    };
    let {framework, localPolyfill, polyfill} = buildManager.buildConf;
    if (file.isEntryScript) {
        Object.assign(pluginOpts, {
            framework
        });
        // polyfill using local variable is prior to global polyfill
        localPolyfill || (pluginOpts.polyfill = polyfill);
        plugins.push([
            programPlugins.app,
            pluginOpts
        ]);
    }
    else if (file.isPageScript) {
        Object.assign(pluginOpts, {tplRefs: file.tplRefs});
        plugins.push([programPlugins.page, pluginOpts]);
    }
    else if (file.isComponentScript) {
        Object.assign(pluginOpts, {tplRefs: file.tplRefs});
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
