/**
 * @file System related API
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */
/* eslint-disable fecs-export-on-declare */

import {detectPlatform} from './util/ua';

const navigator = window.navigator;
const ua = navigator.userAgent;

/**
 * Get system info sync
 *
 * @return {Object}
 */
function getSystemInfoSync() {
    const info = detectPlatform(ua);
    return Object.assign(info, {
        language: (navigator.language || '').replace(/\-/g, '_'),
        pixelRatio: window.devicePixelRatio,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        version: '',
        SDKVersion: '',
        statusBarHeight: 0,
        fontSizeSetting: 16,
        benchmarkLevel: 1
    });
}

/**
 * Get system info
 *
 * @params {Object} options the get options
 * @param {Function=} options.success the success callback
 * @param {Function=} options.fail the fail callback
 * @param {Function=} options.complete the done callback whatever is
 *        success or fail.
 */
function getSystemInfo(options) {
    const {success, complete} = options || {};
    const info = getSystemInfoSync();
    typeof success === 'function' && success(info);
    typeof complete === 'function' && complete(info);
}

export default {
    getSystemInfo,
    getSystemInfoSync
};
