/**
 * @file The weixin mini program env
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global self:false */
/* global window:false */
/* global wx:false */
/* global getApp:false */
/* global getCurrentPages:false */

import globalAPI from './api';

import {getGlobal} from '../util/index';

/**
 * The native app global object
 *
 * @type {Object}
 */
export const appGlobal = getGlobal();

/**
 * The native env variable
 *
 * @return {Object}
 */
export const appEnv = wx;

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

