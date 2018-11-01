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
    'beforeCreate', 'beforeMount', 'mounted',
    'beforeDestroy', 'destroyed', 'beforeUpdate',
    'updated', 'computed', '$rawRefData'
];

/**
 * Normalize component methods
 *
 * @param {Object} componentInfo the component info to normalize
 * @return {Object}
 */
export function normalizeMethods(componentInfo) {
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
