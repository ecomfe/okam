/**
 * @file Create swan component instance
 *       Notice: Using swan custom component, suggest swan-core version `>=1.12`
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createComponent} from '../helper/factory';
import {normalizeComponent} from '../helper/component';
import {normalizeEventArgs, fixEventObject} from './helper/triggerEvent';
import componentBase from '../base/component';

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
 * @param {Object=} options the extra init options
 * @param {Object=} options.refs the component reference used in the component, the
 *        reference information is defined in the template
 * @return {Object}
 */
export default function extendComponent(componentInfo, options) {
    return createComponent(
        componentInfo,
        componentBase,
        normalizeComponent,
        options
    );
}
