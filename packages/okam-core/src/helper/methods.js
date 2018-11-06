/**
 * @file Component methods normalize helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * The lifecycle methods and properties added in okam
 *
 * @type {Array.<string>}
 */
const extendPropMethods = [
    'beforeCreate',
    'beforeMount', 'mounted',
    'beforeDestroy', 'destroyed',
    'beforeUpdate', 'updated'
];

/**
 * Normalize component methods
 *
 * @param {Object} componentInfo the component info to normalize
 * @param {Array.<string>=} extraPropMethods the extra property or methods
 *        to normalize，optional
 * @return {Object}
 */
export function normalizeMethods(componentInfo, extraPropMethods) {
    let methods = {};
    let target = extendPropMethods;
    if (extraPropMethods) {
        target = [].concat(target, extraPropMethods);
    }

    // move new added methods and properties to methods object
    target.forEach(k => {
        let value = componentInfo[k];
        if (typeof value === 'function') {
            methods[k] = value;
        }
        else if (value != null) {
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
