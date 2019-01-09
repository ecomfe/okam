/**
 * @file Create quick app component instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createComponent} from '../helper/factory';
import {extractMethodsToOuterContext} from '../helper/methods';
import componentBase from './base/component';

/**
 * Normalize the component information
 *
 * @inner
 * @param {Object} componentInfo the component information to normalize
 * @return {Object}
 */
function normalizeQuickAppComponent(componentInfo) {
    return extractMethodsToOuterContext(componentInfo);
}

/**
 * Create component instance
 *
 * @param {Object} componentInfo the component information
 * @param {Object=} options the extra init options
 * @param {Object=} options.refs the component reference used in the
 *        component, the reference information is defined in the template
 * @return {Object}
 */
export default function extendComponent(componentInfo, options) {
    return createComponent(
        componentInfo,
        componentBase,
        normalizeQuickAppComponent,
        options
    );
}

