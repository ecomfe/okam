/**
 * @file Transform ant event attribute
 * @author sparklewhy@gmail.com
 */

'use strict';

const {EVENT_REGEXP} = require('../base/constant');
const eventTransformer = require('../base/event');

/**
 * Parse event bind information
 *
 * @inner
 * @param {Object} tplOpts template parse options
 * @param {string} name  event bind attribute name
 * @return {Object}
 */
function parseEventName(tplOpts, name) {
    let eventAttrName = name.replace(EVENT_REGEXP, '');
    let [eventType, ...eventModifiers] = eventAttrName.split('.');
    let eventMode = 'on';

    if (eventType === 'click') {
        eventType = 'tap';
    }

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

    let formatEventType = eventType.charAt(0).toUpperCase() + eventType.substr(1);
    eventAttrName = eventMode + formatEventType;

    return {
        eventType,
        eventAttrName,
        eventModifiers
    };
}

module.exports = function (attrs, name, tplOpts) {
    let eventInfoParser = parseEventName.bind(null, tplOpts);
    return eventTransformer(attrs, name, tplOpts, eventInfoParser);
};
