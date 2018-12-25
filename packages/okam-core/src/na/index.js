/**
 * @file The mini program API
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global wx:false */
/* global my:false */
/* global swan:false */
/* global self:false */
/* global window:false */
/* global getCurrentPages:false */
/* global getApp:false */
/* eslint-disable fecs-prefer-destructure */

const envGlobal = (function getGlobal() {
    if (typeof window === 'object' && window && window.Math === Math) {
        return window;
    }

    /* istanbul ignore next */
    if (typeof self === 'object' && self) {
        return self;
    }

    try {
        if (typeof Function === 'function') {
            return Function('return this')();
        }
    }
    catch (e) {

    }

    /* istanbul ignore next */
    return (typeof global === 'object' && global) || this || {};
})();

/**
 * The global object
 *
 * @type {Object}
 */
export {envGlobal as global};

/**
 * Whether is running in Tencent wx mini program env
 *
 * @type {boolean}
 */
export const isWxEnv = (function () {
    /* istanbul ignore next */
    return !!(typeof wx === 'object' && wx && typeof wx.getSystemInfo === 'function');
})();

/**
 * Whether is running in Baidu swan mini program env
 *
 * @type {boolean}
 */
export const isSwanEnv = (function () {
    /* istanbul ignore next */
    return !!(typeof swan === 'object' && swan && typeof swan.getSystemInfo === 'function');
})();

/**
 * Whether is running in Ali ant mini program env
 *
 * @type {boolean}
 */
export const isAntEnv = (function () {
    /* istanbul ignore next */
    return !!(typeof my === 'object' && my && typeof my.getSystemInfo === 'function');
})();

/**
 * Native env variable
 *
 * @param {Object}
 */
export const env = (function getEnv() {
    /* istanbul ignore next */
    if (isSwanEnv) {
        return swan;
    }

    /* istanbul ignore next */
    if (isWxEnv) {
        return wx;
    }

    /* istanbul ignore next */
    if (isAntEnv) {
        return my;
    }

    return envGlobal;
})();

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

