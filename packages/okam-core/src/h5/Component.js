/**
 * @file Create h5 app component instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createComponent} from '../helper/factory';
import componentBase from './base/component';

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
    options || (options = {});
    options.isH5 = true;
    return createComponent(
        componentInfo,
        componentBase,
        null,
        options
    );
}

