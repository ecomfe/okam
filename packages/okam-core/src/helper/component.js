/**
 * @file Component normalizer helper
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeMethods} from './methods';

/**
 * Normalize component props data using mini program syntax
 *
 * @param {Object} props the props data to normalize
 * @return {?Object}
 */
function normalizeProps(props) {
    Object.keys(props).forEach(k => {
        let propValue = props[k];
        if (propValue && propValue.default !==  undefined) {
            propValue.value = propValue.default;
            delete propValue.default;
        }
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
    let {props, properties, mixins, behaviors} = componentInfo;

    if (!properties && props) {
        delete componentInfo.props;
        componentInfo.properties = normalizeProps(props);
    }

    if (!behaviors && mixins) {
        delete componentInfo.mixins;
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
    normalizeMethods(componentInfo);

    return componentInfo;
}
