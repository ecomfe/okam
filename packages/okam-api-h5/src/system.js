/**
 * @file System related API
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */
/* global location:false */
/* global document:false */
/* eslint-disable fecs-export-on-declare */

import {detectPlatform} from './util/ua';
import {callback} from './util';

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
 * @param {Object} options the get options
 * @param {Function=} options.success the success callback
 * @param {Function=} options.fail the fail callback
 * @param {Function=} options.complete the done callback whatever is success or fail.
 */
function getSystemInfo(options) {
    const {success, complete} = options || {};
    const info = getSystemInfoSync();
    typeof success === 'function' && success(info);
    typeof complete === 'function' && complete(info);
}

/**
 * getEnvInfoSync API
 *
 * mock for h5
 *
 * @return {Object}
 */
function getEnvInfoSync() {
    const {appKey = '', appName = ''} = process.env;
    return {
        appKey,
        appName,
        lastAppURL: location.href,
        sdkVersion: location.protocol,
        scheme: '999.999.999',
        env: process.env.NODE_ENV || 'production'
    };
}

/**
 * setClipboardData API
 *
 * @param {Object} options the get options
 * @param {string} options.data the data copied on clipboard
 * @param {Function=} options.success the success callback
 * @param {Function=} options.fail the fail callback
 * @param {Function=} options.complete the done callback whatever is success or fail.
 */
function setClipboardData(options = {}) {
    const {
        data,
        success,
        fail,
        complete
    } = options;

    if (typeof options.data !== 'string') {
        const errMsg = 'setClipboardData:fail parameter error: data is required and should not be an empty string';
        const typeError = new Error(errMsg);
        typeError.code = 904;

        callback(fail, errMsg);
        throw typeError;
    }

    if (!document.queryCommandSupported || !document.queryCommandSupported('copy')) {
        const errMsg = 'setClipboardData:fail device not support';
        const err = new Error(errMsg);

        err.code = 1001;
        callback(fail, errMsg);
        throw err;
    }

    const isRTL = (document.documentElement.getAttribute('dir') === 'rtl');
    let fakeElem = document.createElement('textarea');
    fakeElem.style.fontSize = '12pt';
    fakeElem.style.border = '0';
    fakeElem.style.padding = '0';
    fakeElem.style.margin = '0';

    fakeElem.style.position = 'absolute';
    fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
    let yPosition = window.pageYOffset || document.documentElement.scrollTop;
    fakeElem.style.top = `${yPosition}px`;

    fakeElem.setAttribute('readonly', '');
    fakeElem.value = data;

    document.body.appendChild(fakeElem);

    fakeElem.select();
    fakeElem.setSelectionRange(0, fakeElem.value.length);

    const result = document.execCommand('copy');

    document.body.removeChild(fakeElem);
    fakeElem = undefined;

    if (!result) {
        const errMsg = 'setClipboardData:fail execommand copy fail';
        const err = new Error(errMsg);
        err.code = 1001;

        callback(fail, errMsg);
        throw err;
    }
    callback(success);
    callback(complete);
}

export default {
    getSystemInfo,
    getEnvInfoSync,
    getSystemInfoSync,
    setClipboardData
};
