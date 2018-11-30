/**
 * @file The quick app env
 * @author sparklewhy@gmail.com
 */

'use strict';

import app from '@system.app';
import globalAPI from './api/index';

/* eslint-disable fecs-camelcase */

/**
 * The app global object
 *
 * @type {Object}
 */
export const appGlobal = Object.getPrototypeOf(global) || global;

/**
 * The native env variable
 *
 * @type {Object}
 */
export const appEnv = appGlobal;

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
    return app;
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

