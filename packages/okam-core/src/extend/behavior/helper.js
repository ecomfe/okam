/**
 * @file The helper of behavior
 * @author sparklewhy@gmail.com
 */

'use strict';

import strategy from './strategy';

/**
 * The extend lifecycle hooks in okam
 *
 * @type {Object}
 */
const okamExtendLifecycleHookMap = {
    beforeCreate: 1,
    beforeMount: 1,
    mounted: 1,
    beforeDestroy: 1,
    destroyed: 1,
    beforeUpdate: 1,
    updated: 1
};

/**
 * The okam lifecycle hook map
 *
 * @type {Object}
 */
const okamLifecycleHookMap = Object.assign(
    {}, okamExtendLifecycleHookMap, {created: 1}
);

/**
 * The okam lifecycle hooks
 *
 * @type {Array.<string>}
 */
const okamLifecycleHooks = Object.keys(okamLifecycleHookMap);

/**
 * The extend attributes in okam
 *
 * @type {Object}
 */
const okamExtendAttributes = {
    computed: 1
};

/**
 * The mixins attribute
 *
 * @const
 * @type {string}
 */
const MIXINS_ATTR = 'mixins';

/**
 * Mixin the target with the source
 *
 * @inner
 * @param {Object} target the target
 * @param {Object} source the source
 * @param {string} k the key
 * @param {Object=} opts the mixin options
 */
function doMixin(target, source, k, opts) {
    let {
        mixinAttrName = MIXINS_ATTR,
        lifecycleHookMap = okamLifecycleHookMap,
        mixinStrategy = strategy.mixin
    } = opts || {};

    if (k === mixinAttrName) {
        return;
    }

    let mixinHandler = mixinStrategy[k];
    if (mixinHandler) {
        target[k] = mixinHandler(target[k], source[k]);
    }
    else if (lifecycleHookMap[k]) {
        let child = target[k];
        let parent = source[k];

        if (!Array.isArray(child)) {
            child = child ? [child] : [];
        }

        if (!Array.isArray(parent)) {
            parent = parent ? [parent] : [];
        }

        child.unshift.apply(child, parent);
        target[k] = child;
    }
    else if (!target.hasOwnProperty(k)) {
        target[k] = source[k];
    }
}

/**
 * Initialize component/behavior mixins options for native Behavior support
 *
 * @param {Object} componentOrBehavior the component or behavior to init
 * @param {Object} extendMixin the extend mixin used to init
 */
export function initMixinsOption(componentOrBehavior, extendMixin) {
    const mixins = componentOrBehavior.mixins;
    if (!Array.isArray(mixins) || !mixins.length) {
        return;
    }

    const behaviors = [];
    const minxiNum = mixins.length;
    for (let i = 0; i < minxiNum; i++) {
        let item = mixins[i];
        if (typeof item === 'function') {
            let {mixin, behavior} = item();
            behavior && (behaviors.push(behavior));

            mixin && Object.keys(mixin).forEach(
                k => doMixin(extendMixin, mixin, k)
            );
        }
        else {
            // native behavior, e.g., wx:form-field
            behaviors.push(item);
        }
    }

    // replace the value of mixins with native behavior
    componentOrBehavior.mixins = behaviors;
}

/**
 * Normalize behavior
 *
 * @param {Object} item the behavior info to normalize
 * @return {Object}
 */
export function normalizeBehavior(item) {
    let behaviorObj = {};
    let extendBehavior = {};

    // split behavior to extended lifecycle behavior and native behavior mixin
    Object.keys(item).forEach(k => {
        let value = item[k];
        if (okamExtendLifecycleHookMap[k]) {
            let list = extendBehavior[k];
            list || (list = extendBehavior[k] = []);
            value && list.push(value);
        }
        else if (okamExtendAttributes[k]) {
            extendBehavior[k] = value;
        }
        else {
            behaviorObj[k] = value;
        }
    });

    // replace the value of mixins with native behavior
    initMixinsOption(item, extendBehavior);

    return {
        mixin: extendBehavior, // okam'll implement this extended mixin
        behavior: behaviorObj
    };
}

/**
 * Flatten mixins for not support native behavior or Page mixins
 *
 * @inner
 * @param {Array.<string|Object>} mixins the mixins
 * @param {Object} target the target component or behavior
 * @param {Object=} opts the mixin options
 */
function flattenMxins(mixins, target, opts) {
    mixins.forEach(item => {
        if (typeof item === 'function') {
            item = item(true); // return component definition
        }

        if (!item || typeof item !== 'object') {
            return;
        }

        let submixins = item.mixins;
        if (Array.isArray(submixins) && submixins.length) {
            item = Object.assign({}, item);
            flattenMxins(submixins, item, opts);
        }

        Object.keys(item).forEach(
            k => doMixin(target, item, k, opts)
        );
    });
}

/**
 * Do mixin for the given component using the given behaviors
 *
 * @param {Object} component the component info
 * @param {Array.<Object>} behaviors the behaviors to mixin
 * @param {Object=} opts the mixin options, optional
 * @param {Array.<string>=} opts.lifecycleHooks the lifecycle hooks
 * @param {Object=} opts.lifecycleHookMap the lifecycle hook map
 * @param {string=} opts.mixinAttrName the mixin attribute name
 * @param {Object=} opts.mixinStrategy the mixin strategy
 */
export function mixin(component, behaviors, opts) {
    flattenMxins(behaviors, component, opts);

    let {lifecycleHooks = okamLifecycleHooks} = opts || {};
    lifecycleHooks.forEach(k => {
        let handlers = component[k];
        if (Array.isArray(handlers)) {
            component[k] = function (...args) {
                handlers.forEach(
                    item => {
                        typeof item === 'function'
                            && item.apply(this, args);
                    }
                );
            };
        }
    });
}
