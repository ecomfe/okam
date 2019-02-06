/**
 * @file Helper of the processor plugin options
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */

const {
    require: customRequire
} = require('../../../util');

function ensureDepAvailable(name, plugin, root) {
    if (plugin.deps && plugin.deps.length) {
        customRequire.ensure(name, plugin.deps, root);
    }
}

function getPlugin(plugin, builtin, root) {
    let pluginName = plugin;
    let pluginOpts;
    let pluginHandler = plugin;
    const noInit = typeof plugin === 'function';

    if (Array.isArray(plugin)) {
        pluginName = plugin[0];
        pluginOpts = plugin[1];
    }
    else if (typeof plugin === 'object') {
        pluginName = plugin.name;
        pluginOpts = plugin.options;
    }

    if (typeof pluginName === 'string') {
        let builtinPlugin = builtin[pluginName];
        let valueType = typeof builtinPlugin;
        if (valueType === 'object') {
            ensureDepAvailable(pluginName, builtinPlugin, root);
            pluginHandler = customRequire(builtinPlugin.path || pluginName, root);
            pluginOpts = Object.assign({}, builtinPlugin.options, pluginOpts);
        }
        else if (valueType === 'string') {
            pluginHandler = customRequire(builtinPlugin, root);
        }
        else if (valueType === 'function') {
            pluginHandler = builtinPlugin;
        }
        else {
            pluginHandler = customRequire(pluginName, root);
        }
    }
    else {
        pluginName = 'anonymous';
    }

    return {
        name: pluginName,
        handler: pluginHandler,
        options: pluginOpts,
        noInit
    };
}

function normalizePlugins(plugins, builtin, root) {
    if (!plugins) {
        return;
    }

    try {
        return plugins.map(item => getPlugin(item, builtin, root));
    }
    catch (ex) {
        throw new Error(
            'Normalize plugins:' + JSON.stringify(plugins)
            + ' error: ' + (ex.message || ex.toString())
        );
    }
}

exports.normalizePlugins = normalizePlugins;
