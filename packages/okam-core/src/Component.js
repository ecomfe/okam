/**
 * @file Create swan component instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createComponent} from './helper/factory';
import {normalizeComponent} from './helper/component';
import {normalizeEventArgs} from './swan/triggerEvent';
import componentBase from './base/component';

/**
 * Fix swan component event args
 *
 * @param {Array} args the event args
 * @return {Array}
 */
componentBase.methods.__beforeEmit = function (args) {
    return normalizeEventArgs(this, args);
};

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
