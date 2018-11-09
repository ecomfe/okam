/**
 * @file Ant template event attribute transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const transformEvent = require('../../transform/base/event');
const {EVENT_REGEXP} = require('../../transform/base/constant');
const {transformMiniProgramEventType} = require('./event-helper');

const NATIVE_EVENT_MAP = {
    'tap': 'tap',
    'touchstart': 'touchStart',
    'touchmove': 'touchMove',
    'touchend': 'touchEnd',
    'touchcancel': 'touchCancel',
    'longtap': 'longTap'
};

/**
 * Parse event bind information
 *
 * @inner
 * @param {string} name  event bind attribute name
 * @param {Object} element the element to transform
 * @param {Object} tplOpts template parse options
 * @param {Object} opts the plugin options
 * @return {Object}
 */
function parseEventName(name, element, tplOpts, opts) {
    let eventAttrName = name.replace(EVENT_REGEXP, '');
    let [eventType, ...eventModifiers] = eventAttrName.split('.');
    let eventMode = 'on';

    eventType = transformMiniProgramEventType(element, eventType, opts);

    const includesStop = eventModifiers.includes('stop');
    const includesCapture = eventModifiers.includes('capture');

    let {logger, file} = tplOpts;
    if (includesCapture) {
        logger.warn(
            `${file.path} template event attribute ${name} using`,
            'capture is not supported in ant env'
        );
    }
    else if (includesStop) {
        eventMode = 'catch';
    }

    let nativeEvent = NATIVE_EVENT_MAP[eventType.toLowerCase()];
    if (nativeEvent) {
        eventType = nativeEvent;
    }

    let formatEventType = eventType.charAt(0).toUpperCase() + eventType.substr(1);
    eventAttrName = eventMode + formatEventType;

    return {
        eventType,
        eventAttrName,
        eventModifiers
    };
}

module.exports = createSyntaxPlugin({
    attribute: {
        event: {
            match: EVENT_REGEXP,
            transform(attrs, name, tplOpts, opts, element) {
                transformEvent(
                    attrs,
                    name,
                    tplOpts,
                    name => {
                        return parseEventName(name, element, tplOpts, opts);
                    }
                );
            }
        }
    }
});
