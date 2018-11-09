/**
 * @file Component helper
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeMethods} from '../../helper/methods';

/**
 * The extra methods to normalize for ant env
 *
 * @const
 * @type {Array.<string>}
 */
const EXTRA_NORMALIZE_METHODS = [
    'created', 'attached', 'ready', 'detached'
];

/**
 * Normalize component props data using mini program syntax
 *
 * @param {Object} props the props data to normalize
 * @return {?Object}
 */
function normalizeProps(props) {
    Object.keys(props).forEach(k => {
        let propValue = props[k];
        let defaultValue = null;
        if (propValue && propValue.default !==  undefined) {
            defaultValue = propValue.default;
        }
        props[k] = defaultValue;
    });
    return props;
}

/**
 * Normalize the component or behavior attribute names to native
 *
 * @param {Object} componentInfo the component to normalize
 * @return {Object}
 */
export function normalizeAttributeNames(componentInfo) {
    let {props} = componentInfo;

    props && (componentInfo.props = normalizeProps(props));

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
    normalizeMethods(componentInfo, EXTRA_NORMALIZE_METHODS);

    return componentInfo;
}
