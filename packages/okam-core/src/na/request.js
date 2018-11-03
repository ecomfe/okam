/**
 * @file request utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable no-use-before-define */

import {env} from './index';
import {promisify} from './api';

/**
 * Fetch data by the given url and options
 *
 * @param {string} url the url to fetch
 * @param {Object=} options the fetch options
 * @return {Promise}
 */
function fetchData(url, options) {
    let {method = 'GET'} = options || {};
    method = method.toUpperCase();

    return httpApi.request(Object.assign({url}, options, {method}));
}

/**
 * Get data by the given url and options using GET method
 *
 * @param {string} url the url to fetch
 * @param {Object=} options the fetch options
 * @return {Promise}
 */
function getData(url, options) {
    return fetchData(url, Object.assign({}, options, {method: 'GET'}));
}

/**
 * Post data by the given url and options using POST method
 *
 * @param {string} url the url to fetch
 * @param {Object=} options the fetch options
 * @return {Promise}
 */
function postData(url, options) {
    return fetchData(url, Object.assign({}, options, {method: 'POST'}));
}

const httpApi = {
    request: promisify(env.request, env),
    fetch: fetchData,
    get: getData,
    post: postData
};

/* eslint-disable fecs-export-on-declare */
export default httpApi;
