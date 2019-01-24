/**
 * @file Toutiao template event attribute transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const transformOriginEvent = require('../../transform/base/event');
const {
    EVENT_REGEXP,
    NOT_SUPPORT_MODIFIERS,
    EVENT_HANDLE_REGEXP
} = require('../../transform/base/constant');
const {parseWxSwanEventName} = require('./event-helper');

function transformCustomCompEvent(attrs, name, tplOpts, parseEventName) {
    // eventType, like 'tap'
    // eventAttrName, like 'bindtap'
    // eventModifier, like '[once,self]'
    let {eventAttrName, eventModifiers} = parseEventName(name);
    let {logger, file, appType} = tplOpts;

    NOT_SUPPORT_MODIFIERS.forEach(item => {
        if (eventModifiers.includes(item)) {
            logger.warn(
                `${file.path} template event attribute ${name}`,
                `is not support with ${item} modifier in ${appType} env`
            );
        }
    });

    let methodName = attrs[name].trim();
    methodName = methodName.replace(EVENT_HANDLE_REGEXP, '$1');

    if (attrs.hasOwnProperty(eventAttrName)) {
        logger.warn(`${file.path} template attribute ${name} is conflicted with ${eventAttrName}`);
    }

    attrs[eventAttrName] = methodName;
    delete attrs[name];
}

module.exports = createSyntaxPlugin({
    attribute: {
        event: {
            match: EVENT_REGEXP,
            transform(attrs, name, tplOpts, opts, element) {

                let {customComponentTags} = opts || {};

                // tt custom component don't support data-xxx
                // origin component support
                let transformEvent = customComponentTags
                    ? transformCustomCompEvent
                    : transformOriginEvent;

                transformEvent(
                    attrs,
                    name,
                    tplOpts,
                    name => parseWxSwanEventName(name, element, tplOpts, opts)
                );
            }
        }
    }
});
