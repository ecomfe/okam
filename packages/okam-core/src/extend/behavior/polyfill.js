/**
 * @file The native behavior polyfill
 * @author sparklewhy@gmail.com
 */

'use strict';

import {mergeObject, deepMerge} from './strategy';
import {mixin} from './helper';

/**
 * The mixin strategy
 *
 * @type {Object}
 */
const mixinStrategy = {
    data: deepMerge,
    methods: mergeObject,
    properties: mergeObject
};

/**
 * The native component lifecycles
 *
 * @type {Object}
 */
const lifecycleHookMap = {
    created: 1,
    attached: 1,
    ready: 1,
    moved: 1,
    detached: 1
};

/**
 * The behaviors attribute name
 *
 * @const
 * @type {string}
 */
const BEHAVIORS_ATTR = 'behaviors';

/**
 * Merge behaviors to component
 *
 * @param {Object} component the component
 * @return {Object}
 */
export default function (component) {
    mixin(component, component.behaviors, {
        lifecycleHooks: Object.keys(lifecycleHookMap),
        lifecycleHookMap,
        mixinAttrName: BEHAVIORS_ATTR,
        mixinStrategy
    });

    // remove behaviors value
    component[BEHAVIORS_ATTR] = undefined;

    return component;
}
