/**
 * @file Data helper
 * @author sparklewhy@gmail.com
 */

'use strict';

const ARRAY_INDEX_ACCESS_REGEXP = /\[(\d+)\]$/;

function getPathInfo(key) {
    let match = ARRAY_INDEX_ACCESS_REGEXP.exec(key);
    if (match) {
        let arrIdx = parseInt(match[1], 10);
        key = key.replace(ARRAY_INDEX_ACCESS_REGEXP, '');
        return {
            key,
            index: arrIdx
        };
    }

    return key;
}

function initPathDataInfo(ctx, path, opts) {
    let parts = path.split('.');
    let result = ctx;
    let key;
    let isSettingNewValue = opts && opts.hasOwnProperty('value');
    let lastIdx = isSettingNewValue ? parts.length - 1 : parts.length;
    for (let i = 0; i < lastIdx; i++) {
        key = parts[i];
        let keyInfo = getPathInfo(key);
        if (typeof keyInfo === 'string') {
            result = result[keyInfo];
        }
        else {
            result = result[keyInfo.key];
            let idx = keyInfo.index;
            result = typeof result.getItem === 'function'
                ? result.getItem(idx) : result[idx];
        }
    }

    if (isSettingNewValue) {
        key = parts[lastIdx];
        let value = opts.value;
        let keyInfo = getPathInfo(key);
        if (typeof keyInfo === 'string') {
            result[keyInfo] = value;
        }
        else {
            let arr = result[keyInfo.key];
            let idx = keyInfo.index;
            arr.splice(idx, 1, value);
        }
    }

    return result;
}

/**
 * Get data by path
 *
 * @param {Object} ctx the component instance
 * @param {string} path the data path
 * @return {*}
 */
export function getDataByPath(ctx, path) {
    return initPathDataInfo(ctx, path);
}

/**
 * Setting component data by path
 *
 * @param {Object} ctx the component instance
 * @param {Object} data the data path to set
 */
export function setDataByPath(ctx, data) {
    if (!data) {
        return;
    }

    Object.keys(data).forEach(path => {
        initPathDataInfo(ctx, path, {value: data[path]});
    });
}
