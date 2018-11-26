/**
 * @file The extended platform related api
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-camelcase */

import {compare} from './semver';

let cachedPlatformInfo;

/**
 * Set cached platform env info
 *
 * @param {Object} info the platform info to set
 */
export function setPlatformInfo(info) {
    cachedPlatformInfo = info;
}

/**
 * Get cached platform env info
 *
 * @return {?Object}
 */
export function getPlatformInfo() {
    if (cachedPlatformInfo) {
        return cachedPlatformInfo;
    }

    if (typeof okam_platform_info === 'object' && okam_platform_info) {
        return okam_platform_info;
    }
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
