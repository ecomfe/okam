/**
 * @file Component helper
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeProps} from './props';

/**
 * The lifecycle methods and properties added in okam
 *
 * @type {Array.<string>}
 */
const extendPropMethods = [
    'beforeCreate', 'beforeMount', 'mounted',
    'beforeDestroy', 'destroyed', 'beforeUpdate',
    'updated', 'computed', '$rawRefData'
];

/**
 * Normalize the component attribute names
 *
 * @param {Object} componentInfo the component to normalize
 * @return {Object}
 */
export function normalizeAttributeNames(componentInfo) {
    let {props, properties, mixins, behaviors} = componentInfo;

    if (!properties && props) {
        componentInfo.properties = normalizeProps(props);
    }

    if (!behaviors && mixins) {
        componentInfo.behaviors = mixins;
    }
    return componentInfo;
}

/**
 * Normalize component definition
 *
 * @param {Object} componentInfo the component info to normalize
 * @return {Object}
 */
export function normalizeComponent(componentInfo) {
    normalizeAttributeNames(componentInfo);

    let methods = {};
    // move new added methods and properties to methods object
    extendPropMethods.forEach(k => {
        let value = componentInfo[k];
        if (typeof value === 'function') {
            methods[k] = value;
        }
        else if (value) {
            // convert non-method prop to method
            methods[k] = () => value;
        }
    });

    if (Object.keys(methods).length) {
        componentInfo.methods = Object.assign(
            {}, methods, componentInfo.methods
        );
    }
    return componentInfo;
}
