/**
 * @file Mini program view template syntax transform plugin
 * @author xiaohong8023@outlook.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */

const {normalizeTransformers, transform} = require('./helper');
const {element, attribute} = require('./wx2swan');

module.exports = {
    tag: transform.bind(this, {
        element: normalizeTransformers(element),
        attribute: normalizeTransformers(attribute)
    })
};
