/**
 * @file Local polyfill babel plugins
 * @author sparklewhy@gmail.com
 */

'use strict';

module.exports = {

    /**
     * Promise API polyfill babel plugin
     *
     * @type {Function}
     */
    promise: require('../polyfill/promise'),


    /**
     * Regeneration runtime API polyfill babel plugin
     *
     * @type {Function}
     */
    async: require('../polyfill/async')
};
