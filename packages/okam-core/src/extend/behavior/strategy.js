/**
 * @file The okam default mixin strategy
 * @author sparklewhy@gmail.com
 */

'use strict';

import {isPlainObject} from '../../util/index';

/**
 * Shadow merge
 *
 * @inner
 * @param {Object} target the target object
 * @param {Object} parent the parent object
 * @return {Object}
 */
export function mergeObject(target, parent) {
    if (!isPlainObject(target) || !isPlainObject(parent)) {
        return target === undefined ? parent : target;
    }

    return Object.assign({}, parent, target);
}

/**
 * Deep merge
 *
 * @param {Object} target the target object
 * @param {Object} parent the parent object
 * @return {Object}
 */
export function deepMerge(target, parent) {
    if (!isPlainObject(target) || !isPlainObject(parent)) {
        return target === undefined ? parent : target;
    }

    target = Object.assign({}, target);

    for (let k in parent) {
        if (parent.hasOwnProperty(k)) {
            let sValue = parent[k];
            let currValue = target[k];

            if (isPlainObject(sValue) && isPlainObject(currValue)) {
                target[k] = deepMerge(currValue, sValue);
            }
            else if (!target.hasOwnProperty(k)) {
                target[k] = sValue;
            }
        }
    }

    return target;
}

/**
 * Convert simple array type to object map type.
 * E.g., ['a', 'b'] => {a: true, b: true}
 *
 * @inner
 * @param {Array.<string|number>} arr the array that has unique element
 * @return {Object}
 */
function arrToMap(arr) {
    return arr.reduce((prev, curr) => {
        prev[curr] = true;
        return prev;
    }, {});
}

/**
 * The lifecycle hooks in okam
 *
 * @type {Object}
 */
const okamLifecycleHooks = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated'
];

/**
 * The default mixin strategy
 *
 * @type {Object}
 */
const okamMixinStrategy = {
    data: deepMerge,
    methods: mergeObject,
    props: mergeObject,
    computed: mergeObject
};

/**
 * The special mixin attributes in okam
 *
 * @type {Object}
 */
const okamExtendAttrMap = arrToMap(Object.keys(okamMixinStrategy));

/**
 * The default mixin strategy config
 *
 * @const
 * @type {Object}
 */
const DEFAULT_STRATEGY_CONFIG = {

    /**
     * The default mixin strategy
     *
     * @type {Object}
     */
    mixin: okamMixinStrategy,

    /**
     * The mixin hooks map which mixin strategy like lifecycle hook
     *
     * @type {Object}
     */
    mixinHooks: arrToMap(okamLifecycleHooks),

    /**
     * The okam mixin attribute map using custom mixin strategy
     *
     * @type {Object}
     */
    mixinAttrs: okamExtendAttrMap,

    /**
     * Whether the runtime using native Behavior
     *
     * @type {boolean}
     */
    useNativeBehavior: true
};

function mergeOptionValue(strategyConf, optName, newOptValue) {
    if (newOptValue) {
        let result;
        let oldValue = strategyConf[optName];
        if (isPlainObject(newOptValue)) {
            result = Object.assign({}, oldValue, newOptValue);

            // filter not to mixin attr or hook
            let tmp = {};
            Object.keys(result).forEach(k => {
                if (result[k]) {
                    tmp[k] = true;
                }
            });
            result = tmp;
        }

        if (!result && Array.isArray(newOptValue)) {
            result = Object.assign({}, oldValue);
            newOptValue.forEach(item => {
                result[item] = true;
            });
        }

        result && (strategyConf[optName] = result);
    }
}

/**
 * Get the mixin strategy config
 *
 * @param {Object=} options the mixin options
 * @param {boolean=} options.useNativeBehavior whether to use native mixin
 *        support, optional, by default true
 * @param {Object|Array.<string>} options.mixinHooks the hooks that want to mixin
 *        by okam, which mixin like lifecycle hook.
 *        If want to replace the default mixin hooks, pass object.
 *        If want to add new mixin hooks, pass array.
 *        E.g., {mixinHooks: {created: false, onShow: true}}
 *        it means the created hook will not mixin by okam, onShow will mixin
 *        like other lifecycle hooks by okam
 * @param {Object|Array.<string>} options.mixinAttrs the attributes that want to
 *        mixin by okam.
 *        If want to replace the default mixin attrs, pass object.
 *        If want to add new mixin object attr, pass array.
 *        E.g., {mixinAttrs: {data: false, myObj: true}}
 *        it means the data attribute will not mixin by okam, myObj will mixin
 *        by okam.
 * @param {Object} options.mixinStrategy the custom mixin strategy for object attribute
 * @return {Object}
 */
export function getStrategyConfig(options) {
    let strategyConf = Object.assign({}, DEFAULT_STRATEGY_CONFIG);

    let {
        useNativeBehavior,
        mixinHooks,
        mixinAttrs,
        mixinStrategy
    } = options || {};
    if (useNativeBehavior != null) {
        strategyConf.useNativeBehavior = !!useNativeBehavior;
    }

    if (mixinStrategy && typeof mixinStrategy === 'object') {
        strategyConf.mixin = Object.assign({}, strategyConf.mixin, mixinStrategy);
    }

    mergeOptionValue(strategyConf, 'mixinHooks', mixinHooks);
    mergeOptionValue(strategyConf, 'mixinAttrs', mixinAttrs, attr => {
        if (!strategyConf.mixin[attr]) {
            // if not specify the mixin strategy,
            // using default object merge strategy
            strategyConf.mixin[attr] = mergeObject;
        }
    });

    return strategyConf;
}

export default DEFAULT_STRATEGY_CONFIG;
