/**
 * @file The mini program global API/object
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global self:false */
/* global window:false */

/**
 * The native app global environment object
 *
 * @inner
 * @type {Object}
 */
let appEnv;

/**
 * The get global app API
 *
 * @inner
 * @type {Function}
 */
let getAppApi;

/**
 * The get current opened pages API
 *
 * @inner
 * @type {Function}
 */
let getCurrPagesApi;

/**
 * The native app global object
 *
 * @inner
 * @type {Object}
 */
let appGlobal = (function getGlobal() {
    /* istanbul ignore next */
    if (typeof window === 'object' && window) {
        return window;
    }

    /* istanbul ignore next */
    if (typeof self === 'object' && self) {
        return self;
    }

    return Function('return this')();
})();

/**
 * Setting the global object
 *
 * @param {Object} g the global object to set
 */
export function setAppGlobal(g) {
    appGlobal = g;
}

/**
 * Get app global object
 *
 * @return {Object}
 */
export function getAppGlobal() {
    return appGlobal;
}

/**
 * Setting the native app environment variable
 *
 * @param {Object} env the env object to set
 * @param {Object=} opts the extra API options
 * @param {Function=} opts.getApp the getAPP api
 * @param {Function=} opts.getCurrentPages the getCurrentPages api
 */
export function setAppEnv(env, opts) {
    appEnv = env;
    if (opts) {
        opts.getApp && (getAppApi = opts.getApp);
        opts.getCurrentPages && (getCurrPagesApi = opts.getCurrentPages);
    }
}

/**
 * Get native env variable
 *
 * @return {Object}
 */
export function getAppEnv() {
    return appEnv;
}

/**
 * Get current app instance
 *
 * @return {Object}
 */
export function getCurrApp() {
    return getAppApi && getAppApi();
}

/**
 * Get current opened pages stack
 *
 * @return {Array}
 */
export function getCurrPages() {
    return getCurrPagesApi && getCurrPagesApi();
}

