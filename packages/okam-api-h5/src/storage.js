/**
 * @file Storage API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */
/* eslint-disable fecs-export-on-declare */

import {processAsyncApiCallback} from './helper';

const DATA_TYPE = {
    NUMBER: 1,
    BOOL: 2,
    STRING: 3,
    OBJECT: 4,
    DATE: 5
};

/**
 * Get to cached data type
 *
 * @inner
 * @param {*} data the data to cache
 * @return {number}
 */
function getDataType(data) {
    if (data instanceof Date) {
        return DATA_TYPE.DATE;
    }

    let typeStr = typeof data;
    switch (typeStr) {
        case 'boolean':
            return DATA_TYPE.BOOL;
        case 'number':
            return DATA_TYPE.NUMBER;
        case 'string':
            return DATA_TYPE.STRING;
        case 'object':
            return DATA_TYPE.OBJECT;
    }
}

/**
 * Get storage cache value
 *
 * @param {string} key the cache key to query
 * @return {*}
 */
function getStorageSync(key) {
    const store = window.localStorage;
    let data = store.getItem(key);
    if (typeof data !== 'string') {
        return data;
    }

    let result = /^(\d+)=(.+)$/.exec(data);
    if (result) {
        let type = +result[1];
        let value = result[2];
        switch (type) {
            case DATA_TYPE.BOOL:
                value = Boolean(value);
                break;
            case DATA_TYPE.NUMBER:
                value = parseInt(value, 10);
                break;
            case DATA_TYPE.object:
                value = JSON.parse(value);
                break;
        }
        return value;
    }
    return data;
}

/**
 * Get storage cache statistic info sync
 * {
 *     keys: ['xx], // the all cached keys used
 *     currentSize: 0, // the current used cache size
 *     limitSize: 0, // the limit cache size
 * }
 *
 * @return {Object}
 */
function getStorageInfoSync() {
    const store = window.localStorage;
    return {
        keys: Object.keys(store),
        limitSize: -1, // unknown
        currentSize: -1 // unknown
    };
}

/**
 * Set storage sync
 *
 * @param {string} key the storage key to set
 * @param {*} data the data to cache
 */
function setStorageSync(key, data) {
    const store = window.localStorage;
    let type = getDataType(data);
    if (!type) {
        data = '';
        type = DATA_TYPE.STRING;
    }

    if (type === DATA_TYPE.OBJECT) {
        data = JSON.stringify(data);
    }

    store.setItem(key, `${type}=${data}`);
}

/**
 * Remove storage cache
 *
 * @param {string} key the cache key to remove
 */
function removeStorageSync(key) {
    window.localStorage.removeItem(key);
}

/**
 * Clear all cache sync
 */
function clearStorageSync() {
    window.localStorage.clear();
}

export default {

    /**
     * Get storage cache value by the cache key
     *
     * @params {Object} options the options
     * @param {string} options.key the cache key to query
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    getStorage(options) {
        let {key} = options;
        let args = [key];
        processAsyncApiCallback('getStorage', getStorageSync, args, options);
    },

    getStorageSync,

    /**
     * Get storage cache statistic info
     *
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    getStorageInfo(options) {
        /* eslint-disable fecs-camelcase */
        let opts = Object.assign({_spread: true}, options);
        processAsyncApiCallback('getStorageInfo', getStorageInfoSync, [], opts);
    },

    getStorageInfoSync,

    /**
     * Set storage
     *
     * @param {Object} options the options to set
     * @param {string} options.key the cache data key to set
     * @param {*} options.data the cache data to set
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    setStorage(options) {
        let {key, data} = options;
        let args = [key, data];
        processAsyncApiCallback('setStorage', setStorageSync, args, options);
    },

    setStorageSync,

    /**
     * Remove storage cache by the given key
     *
     * @param {Object} options the options to remove
     * @param {string} options.key the cache key to remove
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    removeStorage(options) {
        let {key} = options;
        let args = [key];
        processAsyncApiCallback('removeStorage', removeStorageSync, args, options);
    },

    removeStorageSync,

    /**
     * Clear all cache
     *
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    clearStorage(options) {
        processAsyncApiCallback('clearStorage', clearStorageSync, [], options);
    },

    clearStorageSync
};
