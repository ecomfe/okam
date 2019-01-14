/**
 * @file Create App/Page/Component instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {mixin, isFunction} from '../util/index';
import {normalizeOkamProps} from './props';
import {appGlobal} from '../na/index';

let pluginCache = {
    usedExtensions: Object.create(null),
    installedPlugins: [],
    baseClasses: Object.create(null)
};

const APP_TYPE = 'app';
const COMPONENT_TYPE = 'comp';
const PAGE_TYPE = 'page';

/**
 * Initialize the extensions
 *
 * @inner
 * @param {string} type the type to initialize
 * @param {Object} instance the instance to init
 * @param {Object} base the instance base to inherit
 * @return {Object}
 */
function initExtensions(type, instance, base) {
    let cache = pluginCache;
    if (process.env.APP_TYPE === 'quick') {
        if (!appGlobal.okamPluginCache) {
            appGlobal.okamPluginCache = pluginCache;
        }
        cache = appGlobal.okamPluginCache;
    }

    let existedBase = cache.baseClasses[type];
    if (!existedBase) {
        let plugins = cache.usedExtensions[type];
        let args = [{}];
        plugins && Array.prototype.push.apply(args, plugins);
        args.push(base);

        existedBase = mixin.apply(this, args);
        cache.baseClasses[type] = existedBase;
    }

    return mixin.apply(this, [instance, existedBase]);
}

/**
 * Add extension
 *
 * @inner
 * @param {string} type the extension type
 * @param {Object} extension the extension
 */
function addExtension(type, extension) {
    if (!extension) {
        return;
    }

    let cache = pluginCache;
    if (process.env.APP_TYPE === 'quick') {
        cache = appGlobal.okamPluginCache;
    }

    let existedExtensions = cache.usedExtensions[type];
    /* istanbul ignore next */
    if (!existedExtensions) {
        existedExtensions = cache.usedExtensions[type] = [];
    }

    existedExtensions.push(extension);
}

/**
 * Initialize the component data
 *
 * @inner
 * @param {Object} instance the instance to init
 * @param {?Object} options the component init extra options information
 * @param {boolean} isPage whether is page component
 */
function initComponentData(instance, options, isPage) {
    let data = instance.data;
    if (isFunction(data)) {
        instance.data = instance.data();
    }

    instance.$init && instance.$init(isPage, options);
}

/**
 * Clear the base class cache
 */
export function clearBaseCache() {
    pluginCache = {
        usedExtensions: {},
        installedPlugins: [],
        baseClasses: {}
    };
}

/**
 * Use the given plugin
 *
 * @param {Object} plugin the plugin definition
 *        {
 *            init(pluginOpts) {}, // plugin init api
 *            app: {},             // the app extension
 *            component: {},       // the component extension
 *            page: {},            // the page extension
 *        }
 * @param {Object} pluginOpts the plugin options
 * @return {boolean} return true if install successfully
 */
export function use(plugin, pluginOpts) {
    let cache = pluginCache;
    // for quick app, should using global cache to avoid the cache missing
    if (process.env.APP_TYPE === 'quick' && !appGlobal.okamPluginCache) {
        appGlobal.okamPluginCache = pluginCache;
    }

    if (cache.installedPlugins.indexOf(plugin) > -1) {
        return false;
    }

    typeof plugin.init === 'function'
        && plugin.init(pluginOpts);

    let {component, page, app} = plugin;
    if (component) {
        addExtension(COMPONENT_TYPE, component);
        addExtension(PAGE_TYPE, component);
    }

    addExtension(PAGE_TYPE, page);
    addExtension(APP_TYPE, app);

    cache.installedPlugins.push(plugin);
    return true;
}

/**
 * Create App instance
 *
 * @param {Object} instance the instance to init app
 * @param {Object} base the app base
 * @param {Object=} options the extra init options
 * @return {Object}
 */
export function createApp(instance, base, options) {
    let appInfo = initExtensions(APP_TYPE, instance, base);
    options && (appInfo.$appOptions = () => options);
    return appInfo;
}

/**
 * Create page instance
 *
 * @param {Object} instance the instance to init page
 * @param {Object} base the page base
 * @param {Function} normalize used to normalize the page definition
 * @param {Object=} options the extra init options
 * @param {Object=} options.refs the component reference used in the component, the
 *        reference information is defined in the template
 * @return {Object}
 */
export function createPage(instance, base, normalize, options) {
    let pageInfo = initExtensions(PAGE_TYPE, instance, base);

    initComponentData(pageInfo, options, true);
    normalize && (pageInfo = normalize(pageInfo));

    return pageInfo;
}

/**
 * Create component instance
 *
 * @param {Object} instance the instance to init component
 * @param {Object} base the component base
 * @param {Function} normalize used to normalize the component definition
 * @param {Object=} options the extra init options
 * @param {Object=} options.refs the component reference used in the component, the
 *        reference information is defined in the template
 * @return {Object}
 */
export function createComponent(instance, base, normalize, options) {
    let componentInfo = initExtensions(COMPONENT_TYPE, instance, base);

    componentInfo.props = normalizeOkamProps(componentInfo.props);
    initComponentData(componentInfo, options, false);
    normalize && (componentInfo = normalize(componentInfo));

    return componentInfo;
}
