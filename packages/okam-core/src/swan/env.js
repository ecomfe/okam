/**
 * @file The swan mini program env
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global self:false */
/* global window:false */
/* global swan:false */
/* global getApp:false */
/* global getCurrentPages:false */

/**
 * The native app global object
 *
 * @type {Object}
 */
export const appGlobal = (function getGlobal() {
    /* istanbul ignore next */
    if (typeof self === 'object' && self) {
        return self;
    }

    return Function('return this')();
})() || {};

/**
 * The native env variable
 *
 * @return {Object}
 */
export const appEnv = swan;

/**
 * The native env api
 *
 * @type {Object}
 */
export const api = Object.create(swan);

/**
 * The extension okam API
 *
 * @type {Object}
 */
api.okam = {};

/**
 * Get current app instance
 *
 * @return {Object}
 */
export function getCurrApp() {
    return getApp();
}

/**
 * Get current opened pages stack
 *
 * @return {Array}
 */
export function getCurrPages() {
    return getCurrentPages();
}

