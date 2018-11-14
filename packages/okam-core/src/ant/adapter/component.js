/**
 * @file Fix ant native component to adapt okam event handler.
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeEventArgs} from '../helper/triggerEvent';

function handleEvent(eventName, rawHandler, ...args) {
    args.unshift(eventName);
    normalizeEventArgs(this, args);
    rawHandler.call(this, args[1]);
}

function normalizeEventHandlers(component) {
    let props = component.props;
    if (!props) {
        return;
    }

    Object.keys(props).forEach(k => {
        let handler = props[k];
        let len = k.length;
        if (typeof handler !== 'function' || len <= 2 || k.indexOf('on') !== 0) {
            return;
        }

        // extract event name: onAbc => abc
        let eventName = k.substr(3);
        eventName = k.charAt(2).toLowerCase() + eventName;

        props[k] = handleEvent.bind(component, eventName, handler);
    });
}

/**
 * Make the native ant component to adapt to the okam framework
 *
 * @param {Object} component the component to adapt
 * @return {Object}
 */
export default function adaptOKAM(component) {
    let didMount = component.didMount;
    component.didMount = function () {
        normalizeEventHandlers(this);
        didMount && didMount.call(this);
    };
    return component;
}


