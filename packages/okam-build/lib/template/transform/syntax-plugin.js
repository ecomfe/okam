/**
 * @file Mini program view template syntax transform plugin
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */

const {normalizeTransformers, transform} = require('./helper');

/**
 * Get the specified app type view syntax transform plugin.
 *
 * @param {string} appType the app type to transform
 * @return {Object}
 */
module.exports = function (appType) {
    let transformers;
    if (appType === 'wx') {
        transformers = require('./wx');
    }
    else {
        transformers = require('./swan');
    }

    let {element, attribute} = transformers;
    element = normalizeTransformers(element);
    attribute = normalizeTransformers(attribute);

    return {
        tag: transform.bind(this, {element, attribute})
    };
};
