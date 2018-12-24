/**
 * @file Template syntax transformer
 * @author sparklewhy@gmail.com
 */

'use strict';

const elementTransformerMap = require('./element');
const attrTransformerMap = require('./attribute');
const {transformTextNode} = require('./filter');

module.exports = {
    element: elementTransformerMap,
    attribute: attrTransformerMap,
    text: {
        bind: {
            match(node) {
                let value = node.data;
                if (!value || value.indexOf('{{') === -1) {
                    return false;
                }
                return true;
            },
            transform(node, tplOpts, opts) {
                let {logger, config} = tplOpts;
                let filterOpts = config.filter;
                if (!filterOpts) {
                    return;
                }
                return transformTextNode(node, filterOpts, logger);
            }
        }
    }
};
