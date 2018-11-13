/**
 * @file Helper of the `okam-core` framework
 * @author sparkelwhy@gmail.com
 */

'use strict';

const FRAMEWORK_PATH_BASE = 'okam-core/src/';
const FRAMEWORK_POLYFILL_BASE = FRAMEWORK_PATH_BASE + 'polyfill/';

/**
 * The okam framework builtin extension definition
 *
 * @const
 * @type {Object}
 */
const FRAMEWORK_EXTEND_PATH = {
    data: {
        swan: 'extend/data/observable/swan/index',
        ant: 'extend/data/observable/ant/index',
        wx: 'extend/data/observable/wx/index'
    },
    watch: 'extend/data/watch',
    broadcast: 'extend/broadcast',
    behavior: {
        ant: {
            base: 'extend/behavior/index',
            creator: 'extend/behavior/ant/Behavior'
        },
        default: {
            base: 'extend/behavior/index',
            creator: 'extend/behavior/Behavior'
        }
    },
    redux: 'extend/data/redux/index',
    ref: 'extend/ref'
};

/**
 * The internal behavior id prefix
 *
 * @const
 * @type {Object}
 */
const INTERNAL_BEHAVIOR_PREFIX = {
    swan: 'swan://',
    wx: 'wx://'
};

/**
 * The builtin polyfill type
 *
 * @const
 * @type {Object}
 */
const POLYFILL_TYPE = {
    promise: {
        desc: 'Promise API',
        deps: ['promise-polyfill'],
        path: `${FRAMEWORK_POLYFILL_BASE}promise`,
        exports: 'Promise'
    },
    async: {
        desc: 'Async/Await syntax',
        deps: ['regenerator-runtime'],
        path: `${FRAMEWORK_POLYFILL_BASE}async`,
        exports: 'regeneratorRuntime'
    }
};

/**
 * Get polyfill info
 *
 * @param {string} type the polyfill type
 * @return {Object}
 */
exports.getPolyfillInfo = function (type) {
    let info = POLYFILL_TYPE[type];
    if (!info) {
        throw new Error(
            `unknow polyfill ${type} validated polyfill only support`
            + Object.keys(POLYFILL_TYPE)
        );
    }

    info.type = type;
    return info;
};

/**
 * Normalize internal behavior id
 *
 * @param {string} appType the app type to build
 * @param {string} behaviorId the behavior id to normalize
 * @return {string}
 */
exports.normalizeInternalBehavior = function (appType, behaviorId) {
    let prefix = INTERNAL_BEHAVIOR_PREFIX[appType];
    if (!prefix) {
        return behaviorId;
    }

    if (behaviorId.indexOf(prefix) === -1) {
        return prefix + behaviorId;
    }
    return behaviorId;
};

/**
 * Get okam-core framework required module base id
 *
 * @param {string} appType the app type, validated values: wx/ant,
 *        other values will return default base id
 * @param {string} baseName the base name to required
 * @return {string}
 */
exports.getBaseId = function (appType, baseName) {
    let baseId = FRAMEWORK_PATH_BASE;
    if (appType === 'ant') {
        baseId += 'ant/';
    }
    else if (appType === 'wx') {
        baseId += 'wx/';
    }

    return baseId + baseName;
};

/**
 * Get okam-core framework extend module id
 *
 * @param {string} appType the app type: swan/wx/ant
 * @param {string} extendName the extension name
 * @param {boolean=} getConstructor get the extension constructor
 * @return {string|boolean}
 */
exports.getFrameworkExtendId = function (appType, extendName, getConstructor = false) {
    let value = FRAMEWORK_EXTEND_PATH[extendName];
    if (value && typeof value === 'object') {
        value = value[appType] || value.default;
    }

    if (value == null) {
        throw new Error(`unknown ${appType} framework extension: ${extendName}`);
    }

    if (typeof value === 'object') {
        value = getConstructor ? value.creator : value.base;
    }

    return value ? FRAMEWORK_PATH_BASE + value : false;
};
