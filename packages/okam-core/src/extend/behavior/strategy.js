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
 * @param {Object} parent the parget object
 * @return {Object}
 */
export function mergeObject(target, parent) {
    return Object.assign({}, parent, target);
}

/**
 * Deep merge
 *
 * @param {Object} target the target object
 * @param {parent} parent the parent object
 * @return {Object}
 */
export function deepMerge(target, parent) {
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

export default {

    /**
     * The default mixin strategy
     *
     * @type {Object}
     */
    mixin: {
        data: deepMerge,
        methods: mergeObject,
        props: mergeObject,
        computed: mergeObject
    },

    /**
     * Whether the runtime using native Behavior
     *
     * @type {boolean}
     */
    useNativeBehavior: true
};
