/**
 * @file The extension api of the env
 * @author sparklewhy@gmail.com
 */

'use strict';

import {getAppEnv} from './index';

/**
 * The cached system env info
 *
 * @inner
 * @type {Object}
 */
let systemInfo;

/**
 * Init system env info.
 * If initialized ever, call it again will not work.
 * If initialized done, call it again will execute callback at once.
 *
 * @param {Function=} callback the callback to execute when initialized done.
 */
export function initSystemInfo(callback) {
    if (systemInfo) {
        callback && callback(null, systemInfo);
        return;
    }

    if (systemInfo === null) {
        return;
    }

    systemInfo = null;
    getAppEnv().getSystemInfo({
        success(info) {
            systemInfo = info;
            callback && callback(null, info);
        },
        fail(err) {
            systemInfo = false;
            callback && callback(err);
        }
    });
}

/**
 * Set cached system env info
 *
 * @param {Object} info the system info to set
 */
export function setSystemInfo(info) {
    systemInfo = info;
}

/**
 * Get cached system env info
 *
 * @return {Object}
 */
export function getSystemInfo() {
    if (systemInfo === false) {
        throw new Error('get system info fail');
    }
    else if (!systemInfo) {
        throw new Error('system info is not set');
    }

    return systemInfo;
}

/**
 * Check the running env whether is ios.
 *
 * @param {Object=} systemInfo the system env info,
 *        by default using the cache system env info
 * @return {boolean}
 */
export function isIOS(systemInfo) {
    let info = systemInfo || getSystemInfo();
    let system = info.system;
    return system && /^ios(\s.*|)$/i.test(system);
}

/**
 * Check the running env whether is android.
 *
 * @param {Object=} systemInfo the system env info,
 *        by default using the cache system env info
 * @return {boolean}
 */
export function isAndroid(systemInfo) {
    let info = systemInfo || getSystemInfo();
    let system = info.system;
    return system && /^android(\s.*|)$/i.test(system);
}
