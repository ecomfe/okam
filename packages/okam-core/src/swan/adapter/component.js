/**
 * @file Fix swan native component to adapt okam event handler.
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeEventArgs} from '../triggerEvent';

/**
 * Emit custom component event
 *
 * @param  {...any} args the event arguments
 */
function emit(...args) {
    // fix custom component event args
    normalizeEventArgs(this, args);
    this.triggerEvent.apply(this, args);
}

/**
 * Make the native swan component to adapt to the okam framework
 *
 * @param {Object} component the component to adapt
 * @return {Object}
 */
export default function adaptOKAM(component) {
    let methods = component.methods || (component.methods = {});
    if (!methods.$emit) {
        methods.$emit = emit;
    }
    return component;
}


