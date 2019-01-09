/**
 * @file The helper of behavior
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * The mixin attribute name
 *
 * @const
 * @type {string}
 */
const MIXIN_ATTR_NAME = 'mixins';

/**
 * Mixin the target with the source
 *
 * @inner
 * @param {Object} target the target
 * @param {Object} source the source
 * @param {string} k the key
 * @param {Object} opts the mixin options
 */
function doMixin(target, source, k, opts) {
    let {
        mixinAttrName = MIXIN_ATTR_NAME,
        lifecycleHookMap,
        mixinStrategy
    } = opts;

    if (k === mixinAttrName) {
        return;
    }

    let mixinHandler = mixinStrategy && mixinStrategy[k];
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
 * @param {Object} opts the mixin options, optional
 * @param {boolean} opts.useNativeBehavior whether using native behavior support
 * @param {Object} opts.lifecycleHookMap the lifecycle hook map
 * @param {string=} opts.mixinAttrName the mixin attribute name
 * @param {Object=} opts.mixinStrategy the mixin strategy
 */
export function initMixinsOption(componentOrBehavior, extendMixin, opts) {
    const mixins = componentOrBehavior.mixins;
    if (!Array.isArray(mixins) || !mixins.length) {
        return;
    }

    const behaviors = [];
    const mixinNum = mixins.length;
    for (let i = 0; i < mixinNum; i++) {
        let item = mixins[i];
        if (typeof item === 'function') {
            let {mixin, behavior} = item(false, opts);
            behavior && (behaviors.push(behavior));

            mixin && Object.keys(mixin).forEach(
                k => doMixin(extendMixin, mixin, k, opts)
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
 * @param {Object=} opts the normalize options
 * @param {Object} opts.lifecycleHookMap the extend lifecycle hook map in okam
 * @param {Object} opts.mixinAttrMap the extend attributes map in okam
 * @return {Object}
 */
export function normalizeBehavior(item, opts) {
    let behaviorObj = {};
    let extendBehavior = {};
    let {
        lifecycleHookMap,
        mixinAttrMap
    } = opts;

    // split behavior to extended lifecycle behavior and native behavior mixin
    Object.keys(item).forEach(k => {
        let value = item[k];
        if (lifecycleHookMap[k]) {
            let list = extendBehavior[k];
            list || (list = extendBehavior[k] = []);
            value && list.push(value);
        }
        else if (mixinAttrMap[k]) {
            extendBehavior[k] = value;
        }
        else {
            behaviorObj[k] = value;
        }
    });

    // replace the value of mixins with native behavior
    initMixinsOption(item, extendBehavior, opts);

    if (behaviorObj && Object.keys(behaviorObj).length === 0) {
        behaviorObj = null;
    }

    return {
        mixin: extendBehavior, // okam will implement this extended mixin
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
function flattenMixins(mixins, target, opts) {
    mixins.forEach(item => {
        if (typeof item === 'function') {
            item = item(true, opts); // return okam mixin definition
        }

        if (!item || typeof item !== 'object') {
            return;
        }

        let submixins = item.mixins;
        if (Array.isArray(submixins) && submixins.length) {
            item = Object.assign({}, item);
            flattenMixins(submixins, item, opts);
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
 * @param {Object} opts the mixin options, optional
 * @param {boolean} opts.useNativeBehavior whether using native behavior support
 * @param {Object} opts.lifecycleHookMap the lifecycle hook map
 * @param {string=} opts.mixinAttrName the mixin attribute name
 * @param {Object} opts.mixinStrategy the mixin strategy
 * @param {Object} opts.mixinAttrMap the custom mixin attributes map in okam
 */
export function mixin(component, behaviors, opts) {
    flattenMixins(behaviors, component, opts);

    let {lifecycleHookMap} = opts;
    let lifecycleHooks = Object.keys(lifecycleHookMap);
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

/**
 * Init component mixin behaviors
 *
 * @param {Object} component the component definition
 * @param {boolean} isPage whether is page component
 * @param {Object} strategy the mixin strategy
 */
export function initBehaviors(component, isPage, strategy) {
    let behaviors = component.mixins;
    if (!behaviors) {
        return;
    }

    let {useNativeBehavior, mixinAttrs, mixinHooks, mixin: mixinStrategy} = strategy;
    let mixinOpts = {
        useNativeBehavior,
        mixinStrategy,
        mixinAttrMap: mixinAttrs,
        lifecycleHookMap: mixinHooks
    };

    if (isPage || !useNativeBehavior) {
        mixin(component, behaviors, mixinOpts);
    }
    else {
        let extendMixin = {};
        initMixinsOption(component, extendMixin, mixinOpts);
        mixin(component, [extendMixin], mixinOpts);
    }
}
