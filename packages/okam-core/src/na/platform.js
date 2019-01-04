/**
 * @file The extended platform related api
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-camelcase */

import {compare} from './semver';
import {api, appGlobal} from './index';

/**
 * Init platform info
 *
 * @inner
 * @param {Function} callback the callback to execute when platform info get done
 */
function initPlatformInfo(callback) {
    api.getSystemInfo({
        success(info) {
            callback && callback(null, info);
        },
        fail(err) {
            callback && callback(err);
        }
    });
}

/**
 * Ensure the platform info is ready and accessible
 *
 * @param {Function} callback the callback to execute when platform info ready
 */
export function ensure(callback) {
    if (appGlobal.okamPlatformInfo) {
        callback(appGlobal.okamPlatformInfo);
    }
    else {
        initPlatformInfo((err, res) => {
            if (!err) {
                // cache platform info
                appGlobal.okamPlatformInfo = res;
                callback(res);
            }
        });
    }
}

/**
 * Set cached platform env info
 *
 * @param {Object} info the platform info to set
 */
export function setPlatformInfo(info) {
    appGlobal.okamPlatformInfo = info;
}

/**
 * Get cached platform env info
 *
 * @return {?Object}
 */
export function getPlatformInfo() {
    return appGlobal.okamPlatformInfo;
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
