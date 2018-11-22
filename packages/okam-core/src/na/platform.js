/**
 * @file The extended platform related api
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-camelcase */

import {appEnv, appGlobal} from './index';
import {compare} from './semver';

/**
 * In quick app, sometimes, it'll destroy required module
 * which leading to the cache module info missing.
 * So, here cache the info to global.
 *
 * @inner
 * @type {Object}
 */
const okamGlobal = appGlobal.okam_global || (appGlobal.okam_global = {});

/**
 * Init platform env info.
 * If initialized ever, call it again will not work.
 * If initialized done, call it again will execute callback at once.
 *
 * @param {Function=} callback the callback to execute when initialized done.
 */
export function initPlatformInfo(callback) {
    let platformInfo = okamGlobal.platformInfo;
    if (platformInfo) {
        callback && callback(null, platformInfo);
        return;
    }

    if (platformInfo === null) {
        return;
    }

    okamGlobal.platformInfo = null;
    appEnv.getSystemInfo({
        success(info) {
            okamGlobal.platformInfo = info;
            callback && callback(null, info);
        },
        fail(err) {
            okamGlobal.platformInfo = false;
            callback && callback(err);
        }
    });
}

/**
 * Set cached platform env info
 *
 * @param {Object} info the platform info to set
 */
export function setPlatformInfo(info) {
    okamGlobal.platformInfo = info;
}

/**
 * Get cached platform env info
 *
 * @return {Object}
 */
export function getPlatformInfo() {
    let platformInfo = okamGlobal.platformInfo;
    if (platformInfo === false) {
        throw new Error('get platform info fail');
    }
    else if (!platformInfo) {
        throw new Error('platform info is not set');
    }

    return platformInfo;
}

/**
 * Check the running env whether is ios.
 *
 * @param {Object=} platformInfo the platform env info,
 *        by default using the cache platform env info
 * @return {boolean}
 */
export function isIOS() {
    let platform = getPlatformInfo().platform;
    return platform && platform.toLowerCase() === 'ios';
}

/**
 * Check the running env whether is android.
 *
 * @return {boolean}
 */
export function isAndroid() {
    let platform = getPlatformInfo().platform;
    return platform && platform.toLowerCase() === 'android';
}

/**
 * Get sdk version
 *
 * @return {string}
 */
export function getSDKVersion() {
    return getPlatformInfo().SKDVersion;
}

/**
 * Check whether the current sdk version is older than the given version.
 *
 * @param {string} version the version to compare
 * @return {boolean}
 */
export function isSDKVersionLt(version) {
    return compare(getSDKVersion(), version) < 0;
}

/**
 * Check whether the current sdk version is older than or same with the given version.
 *
 * @param {string} version the version to compare
 * @return {boolean}
 */
export function isSDKVersionLte(version) {
    return compare(getSDKVersion(), version) <= 0;
}

/**
 * Check whether the current sdk version is newer than the given version.
 *
 * @param {string} version the version to compare
 * @return {boolean}
 */
export function isSDKVersionGt(version) {
    return compare(getSDKVersion(), version) > 0;
}

/**
 * Check whether the current sdk version is newer than or same with the given version.
 *
 * @param {string} version the version to compare
 * @return {boolean}
 */
export function isSDKVersionGte(version) {
    return compare(getSDKVersion(), version) >= 0;
}

/**
 * Check whether the current sdk version is the same with the given version.
 *
 * @param {string} version the version to compare
 * @return {boolean}
 */
export function isSDKVersionEq(version) {
    return compare(getSDKVersion(), version) === 0;
}
