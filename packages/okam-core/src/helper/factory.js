/**
 * @file Create App/Page/Component instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {mixin, isFunction} from '../util/index';
import {normalizeOkamProps} from './props';

let usedExtensions = Object.create(null);
let installedPlugins = [];
let baseClasses = Object.create(null);

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
    let existedBase = baseClasses[type];
    if (!existedBase) {
        let plugins = usedExtensions[type];
        let args = [{}];
        plugins && Array.prototype.push.apply(args, plugins);
        args.push(base);

        existedBase = mixin.apply(this, args);
        baseClasses[type] = existedBase;
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

    let existedExtensions = usedExtensions[type];
    /* istanbul ignore next */
    if (!existedExtensions) {
        existedExtensions = usedExtensions[type] = [];
    }

    existedExtensions.push(extension);
}

/**
 * Initialize the component data
 *
 * @inner
 * @param {Object} instance the instance to init
 * @param {?Object} refData the component reference information
 * @param {boolean} isPage whether is page component
 */
function initComponentData(instance, refData, isPage) {
    let data = instance.data;
    if (isFunction(data)) {
        instance.data = instance.data();
    }

    instance.$init && instance.$init(isPage, refData);
}

/**
 * Clear the base class cache
 */
export function clearBaseCache() {
    baseClasses = {};
    usedExtensions = {};
    installedPlugins = [];
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
    if (installedPlugins.indexOf(plugin) > -1) {
        return false;
    }

    pluginOpts && typeof plugin.init === 'function'
        && plugin.init(pluginOpts);

    let {component, page, app} = plugin;
    if (component) {
        addExtension(COMPONENT_TYPE, component);
        addExtension(PAGE_TYPE, component);
    }

    addExtension(PAGE_TYPE, page);
    addExtension(APP_TYPE, app);

    installedPlugins.push(plugin);
    return true;
}

/**
 * Create App instance
 *
 * @param {Object} instance the instance to init app
 * @param {Object} base the app base
 * @return {Object}
 */
export function createApp(instance, base) {
    return initExtensions(APP_TYPE, instance, base);
}

/**
 * Create page instance
 *
 * @param {Object} instance the instance to init page
 * @param {Object} base the page base
 * @param {Function} normalize used to normalize the page definition
 * @param {Object=} refs the component refs information defined in template
 * @return {Object}
 */
export function createPage(instance, base, normalize, refs) {
    let pageInfo = initExtensions(PAGE_TYPE, instance, base);

    initComponentData(pageInfo, refs, true);
    normalize && (pageInfo = normalize(pageInfo));

    return pageInfo;
}

/**
 * Create component instance
 *
 * @param {Object} instance the instance to init component
 * @param {Object} base the component base
 * @param {Function} normalize used to normalize the component definition
 * @param {Object=} refs the component refs information defined in template
 * @return {Object}
 */
export function createComponent(instance, base, normalize, refs) {
    let componentInfo = initExtensions(COMPONENT_TYPE, instance, base);

    componentInfo.props = normalizeOkamProps(componentInfo.props);
    initComponentData(componentInfo, refs, false);
    normalize && (componentInfo = normalize(componentInfo));

    return componentInfo;
}
