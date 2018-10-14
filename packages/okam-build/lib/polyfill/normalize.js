/**
 * @file Normalize polyfill options
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const preparePolyfill = require('./prepare');
const {getPolyfillInfo} = require('../framework');

module.exports = exports = function (polyfills, rootDir, logger) {
    if (!polyfills) {
        return;
    }

    let result = polyfills.map(item => {
        if (typeof item === 'string') {
            item = getPolyfillInfo(item);
        }

        // init module id to import
        item.id || (item.id = item.path);

        return item;
    });

    // polyfill deps check
    preparePolyfill(result, rootDir, logger);

    return result;
};
