/**
 * @file Quick app template event attribute transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const {EVENT_REGEXP} = require('../../transform/base/constant');
const {toHyphen} = require('../../../../util').string;

// const NATIVE_EVENTS = [
//     'click',
//     'longpress',
//     'focus',
//     'blur',
//     'appear',
//     'disappear',
//     'swipe'
// ];

/**
 * Transform event attribute information
 *
 * @param {Object} attrs the element all attributes
 * @param {string} name  event bind attribute name
 * @param {Object} tplOpts template parse options
 * @param {Object} opts the plugin options
 * @param {Object} element the element to transform
 */
function transformEventAttr(attrs, name, tplOpts, opts, element) {
    let value = attrs[name];
    let eventAttrName = name.replace(EVENT_REGEXP, '');
    let [eventType, ...eventModifiers] = eventAttrName.split('.');

    let {logger, file} = tplOpts;
    if (eventModifiers.length) {
        logger.warn(
            `${file.path} template event attribute \`${name}\` modifiers:`,
            `${eventModifiers.join('.')} is not supported in quick app env`
        );
    }

    delete attrs[name];

    // covert the camel case to kebab-case
    let newName = 'on' + toHyphen(eventType);

    // TODO: $event event params is not supported

    attrs[newName] = value;
}

module.exports = createSyntaxPlugin({
    attribute: {
        event: {
            match: EVENT_REGEXP,
            transform: transformEventAttr
        }
    }
});
