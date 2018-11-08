/**
 * @file Template event attribute transform helper
 * @author sparklewhy@gmail.com
 */

'use strict';

const {EVENT_REGEXP} = require('../../transform/base/constant');

/**
 * Transform mini program event type:
 * `click` -> `tap` only for native component
 *
 * @param {Object} element the element to transform
 * @param {string} eventType the event type to transform
 * @param {Object} opts the transform plugin options
 * @return {string}
 */
function transformMiniProgramEventType(element, eventType, opts) {
    let {customComponentTags} = opts || {};
    let tagName = element.name.toLowerCase();
    let isClickEvent = eventType === 'click';
    if (customComponentTags) {
        let isCustomTag = customComponentTags.some(item => item === tagName);
        if (isCustomTag) {
            return eventType;
        }
    }

    return isClickEvent ? 'tap' : eventType;
}


/**
 * parse event name
 * eg:
 * `@click` -> bindtap
 * `@click.stop` -> catchtap
 * `@click.capture` -> capture-bindtap
 * `@click.capture.stop` -> capture-catchtap
 *
 * @param {string} name  the event attribute
 * @param {Object} element the element to transform
 * @param {Object} tplOpts the template transformation options
 * @param {Object} opts the transform plugin options
 * @return {Object} event type, new attribute name, event modifier
 */
function parseWxSwanEventName(name, element, tplOpts, opts) {
    let eventAttrName = name.replace(EVENT_REGEXP, '');
    let [eventType, ...eventModifiers] = eventAttrName.split('.');
    let eventMode = 'bind';

    eventType = transformMiniProgramEventType(element, eventType, opts);

    const includesStop = eventModifiers.includes('stop');
    const includesCapture = eventModifiers.includes('capture');
    if (includesCapture) {
        eventMode = includesStop ? 'capture-catch:' : 'capture-bind:';
    }
    else if (includesStop) {
        eventMode = 'catch';
    }

    eventAttrName = eventMode + eventType;

    return {
        eventType,
        eventAttrName,
        eventModifiers
    };
}

exports.transformMiniProgramEventType = transformMiniProgramEventType;

exports.parseWxSwanEventName = parseWxSwanEventName;
