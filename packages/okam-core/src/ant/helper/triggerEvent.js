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

    let propData = component.props;
    let dataset = {};
    propData && Object.keys(propData).forEach(k => {
        if (/^data\-.+$/.test(k)) {
            let first = true;
            let dataKey = k.replace(
                /\-(\w)/g,
                (match, char) => {
                    if (first) {
                        first = false;
                        return char.toLowerCase();
                    }
                    return char.toUpperCase();
                }
            );
            dataKey = dataKey.substr('data'.length);
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
        detail: eventData
    };
    args[1] = eventObj;

    return args;
}
