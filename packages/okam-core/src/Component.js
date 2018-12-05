/**
 * @file Create swan component instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createComponent} from './helper/factory';
import {normalizeComponent} from './helper/component';
import {normalizeEventArgs, fixEventObject} from './swan/triggerEvent';
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
 * Fix swan 1.12 event arguments upgrade
 *
 * @param {Object} event the event object
 * @return {Object} the new event object
 */
componentBase.methods.__beforeEventProxy = fixEventObject;

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
