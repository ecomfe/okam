/**
 * @file The h5 app env
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */
/* eslint-disable fecs-camelcase */

/**
 * The app global object
 *
 * @type {Object}
 */
export const appGlobal = window;

/**
 * The native env variable
 *
 * @type {Object}
 */
export const appEnv = window;

/**
 * The native env api
 *
 * @type {Object}
 */
export const api = {};

/**
 * Get current app instance
 *
 * @return {Object}
 */
export function getCurrApp() {
    return null;
}

/**
 * Get current opened pages stack
 *
 * @return {?Array}
 */
export function getCurrPages() {
    // cannot get this information in quick app
    return null;
}

