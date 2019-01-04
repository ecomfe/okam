/**
 * @file Component triggerEvent helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Normalize event arguments to fix the native swan framework bug
 *
 * @param {Component} component current component instance
 * @param {Object} args the event args to normalize
 * @return {Object}
 */
export function normalizeEventArgs(component, args) {
    let eventData = args[1] || {};
    if (eventData.currentTarget && eventData.target) {
        return args;
    }

    let propData = component.properties;
    let dataset = {};
    propData && Object.keys(propData).forEach(k => {
        if (/^data\w+$/.test(k)) {
            let dataKey = k.replace(
                /^data(\w)/,
                (match, char) => char.toLowerCase()
            );
            dataset[dataKey] = propData[k];
        }
    });

    let eventObj = {
        type: args[0],
        currentTarget: {
            dataset,
            id: component.id
        },
        target: {
            dataset,
            id: component.id
        },
        detail: args[1]
    };
    args[1] = eventObj;

    return args;
}

/**
 * Fix event object argument
 *
 * @param {Object} event the event object to fix
 * @return {Object}
 */
export function fixEventObject(event) {
    let detail = event && event.detail;
    // fix 1.12.x event object argument upgrade which to make the event object
    // structure like weixin
    if (detail && detail.currentTarget && detail.target && detail.type) {
        return detail;
    }

    return event;
}
