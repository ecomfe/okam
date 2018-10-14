/**
 * @file Check polyfill dependencies avaliable
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-min-vars-per-destructure */
const {ensure} = require('../util').require;

/**
 * Prepare the dependencies of the polyfill to support.
 *
 * @param {Array.<string>|string} polyfill the polyfill type to support,
 *        `promise` or `async` is currently support type
 * @param {string} rootDir the project root dir
 * @param {Object} logger log util
 */
function preparePolyfillSupport(polyfill, rootDir, logger) {
    if (!polyfill) {
        return;
    }

    if (!Array.isArray(polyfill)) {
        polyfill = [polyfill];
    }

    polyfill.forEach(info => {
        try {
            ensure(info.desc, info.deps, rootDir);
        }
        catch (ex) {
            logger.warn(ex.toString());
        }
    });
}

module.exports = exports = preparePolyfillSupport;
