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
    'beforeUpdate', 'updated',
    ['computed', '$rawComputed'],
    ['watch', '$rawWatch'],
    '$rawRefData'
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
        let name = k;
        let oldName = k;
        if (Array.isArray(k)) {
            name = k[1];
            oldName = k[0];
        }

        let value = componentInfo[oldName];
        if (typeof value === 'function') {
            methods[name] = value;
        }
        else if (value != null) {
            // convert non-method prop to method
            methods[name] = () => value;
        }

        if (value != null && oldName !== name) {
            delete methods[oldName];
        }
    });

    if (Object.keys(methods).length) {
        componentInfo.methods = Object.assign(
            {}, methods, componentInfo.methods
        );
    }
    return componentInfo;
}
