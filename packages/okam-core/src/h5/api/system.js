/**
 * @file System related API
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */
/* eslint-disable fecs-export-on-declare */

import {detectPlatform} from '../util/ua';

const navigator = window.navigator;
const ua = navigator.userAgent;

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

function getSystemInfo(options) {
    const {success, complete} = options || {};
    new Promise(resolve => {
        const info = getSystemInfoSync();
        typeof success === 'function' && success(info);
        typeof complete === 'function' && complete(info);
        resolve(info);
    });
}

export default {
    getSystemInfo,
    getSystemInfoSync
};
