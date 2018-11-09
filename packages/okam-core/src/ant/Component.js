/**
 * @file Create ant component instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import {createComponent} from '../helper/factory';
import {normalizeEventArgs} from './helper/triggerEvent';
import {normalizeComponent} from './helper/component';
import componentBase from './base/component';

/**
 * Fix ant component event args
 *
 * @param {Array} args the event args
 * @return {Array}
 */
componentBase.methods.__beforeEmit = function (args) {
    return normalizeEventArgs(this, args);
};

export default function extendComponent(componentInfo, refComponents) {
    return createComponent(
        componentInfo,
        componentBase,
        normalizeComponent,
        refComponents
    );
}
