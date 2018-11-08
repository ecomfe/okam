/**
 * @file Swan template event attribute transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

const {createSyntaxPlugin} = require('../helper');
const transformEvent = require('../../transform/base/event');
const {EVENT_REGEXP} = require('../../transform/base/constant');
const {parseWxSwanEventName} = require('./event-helper');

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
                        return parseWxSwanEventName(name, element, tplOpts, opts);
                    }
                );
            }
        }
    }
});
