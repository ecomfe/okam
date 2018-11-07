/**
 * @file Create wx component instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createComponent} from '../helper/factory';
import {normalizeComponent} from '../helper/component';
import componentBase from '../base/component';

/**
 * Create component instance
 *
 * @param {Object} componentInfo the component information
 * @param {Object} refComponents the component reference used in the component, the
 *        reference information is defined in the template
 * @return {Object}
 */
export default function extendComponent(componentInfo, refComponents) {
    return createComponent(
        componentInfo,
        componentBase,
        normalizeComponent,
        refComponents
    );
}

