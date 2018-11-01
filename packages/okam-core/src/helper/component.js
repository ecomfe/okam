/**
 * @file Component helper
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeProps} from './props';
import {normalizeMethods} from './methods';

/**
 * Normalize the component or behavior attribute names to native
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
    normalizeMethods(componentInfo);

    return componentInfo;
}
