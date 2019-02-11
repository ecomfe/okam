/**
 * @file The h5 app env
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */
/* eslint-disable fecs-camelcase */
import globalAPI from './api/index';

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
export const api = globalAPI;

/**
 * Get current app instance
 *
 * @return {Object}
 */
export function getCurrApp() {
    return window.__currOkamAppInstance;
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

