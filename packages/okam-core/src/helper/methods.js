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
 * Normalize extended property: convert the extended prop to methods prop
 *
 * @param {Object} component the component instance
 * @param {string} propName the extended property name
 * @param {string} newPropName the new extended property name
 * @param {boolean} isPage whether is page component
 */
export function normalizeExtendProp(component, propName, newPropName, isPage) {
    let value = component[propName];
    if (!value) {
        return;
    }

    delete component[propName];
    if (isPage) {
        component[newPropName] = value;
    }
    else {
        let methods = component.methods;
        methods || (component.methods = methods = {});
        methods[newPropName] = () => value;
    }
}

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
        let currMethods = componentInfo.methods || {};
        componentInfo.methods = currMethods;
        Object.assign(currMethods, methods);
    }

    return componentInfo;
}
