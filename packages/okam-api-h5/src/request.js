/**
 * @file H5 Request API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global XMLHttpRequest:false */

import {isPlainObject} from './util/lang';

const URL_ENCODE_CONTENT_TYPE = 'application/x-www-form-urlencoded';
const JSON_CONTENT_TYPE = 'application/json';
const CONTENT_TYPE_HEADER = 'content-type';

function getContentType(header) {
    if (!isPlainObject(header)) {
        return;
    }

    let found;
    Object.keys(header).some(k => {
        let name = k.toLowerCase();
        if (name === CONTENT_TYPE_HEADER) {
            found = header[k];
            return true;
        }
        return false;
    });

    return found;
}

function setRequestHeaders(xhr, header) {
    if (!isPlainObject(header)) {
        return;
    }

    Object.keys(header).forEach(k => {
        let name = k.toLowerCase().replace(
            /^\w|(\-\w)/, match => match.toUpperCase()
        );
        xhr.setRequestHeader(name, header[k]);
    });
}

function serializeParams(query) {
    let queryStr = [];
    Object.keys(query).forEach(k => {
        let v = query[k];
        queryStr.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    });
    return queryStr.join('&');
}

function appendQueryParams(url, query) {
    if (isPlainObject(query)) {
        query = serializeParams(query);
    }
    else if (typeof query !== 'string') {
        query = null;
    }

    if (!query) {
        return url;
    }

    let queryIdx = url.indexOf('?');
    let hasQuery = queryIdx !== -1;
    if (hasQuery) {
        url = url + (url.substr(queryIdx + 1) ? '&' : '');
    }
    else {
        url += '?';
    }

    query && (url += query);
    return url;
}

function getRequestUrlData(url, data, method, contentType) {
    if (method === 'GET') {
        return {
            url: appendQueryParams(url, data)
        };
    }

    if (method === 'POST') {
        let isObj = isPlainObject(data);
        if (isObj) {
            if (!contentType || contentType === JSON_CONTENT_TYPE) {
                data = JSON.stringify(data);
            }
            else if (contentType === URL_ENCODE_CONTENT_TYPE) {
                data = serializeParams(data);
            }
        }
    }

    return {
        url,
        data
    };
}

function getResponseHeaders(xhr) {
    const headers = xhr.getAllResponseHeaders();
    const arr = headers.trim().split(/[\r\n]+/);
    const headerMap = {};

    arr.forEach(line => {
        let parts = line.split(': ');
        let header = parts.shift();
        let value = parts.join(': ');
        headerMap[header] = value;
    });

    return headerMap;
}

function getResponseData(xhr, dataType, responseType) {
    let data = xhr.response;
    if (dataType == null || dataType === 'json') {
        try {
            typeof data === 'string' && (data = JSON.parse(data));
        }
        catch (ex) {
            // ignore exception
        }
    }
    return data;
}

function processRequestDone(options, statusInfo) {
    const {
        dataType,
        responseType,
        success,
        fail,
        complete
    } = options;

    let errMsg = 'request:';
    if (statusInfo.done) {
        let res = {
            statusCode: this.status,
            header: getResponseHeaders(this),
            data: getResponseData(this, dataType, responseType),
            errMsg: errMsg + 'ok'
        };
        success && success(res);
        complete && complete(res);
        return;
    }

    if (statusInfo.error) {
        errMsg += ('fail ' + (this.statusText || ''));
    }
    else if (statusInfo.timeout) {
        errMsg += 'timeout';
    }
    else if (statusInfo.abort) {
        errMsg += 'abort';
    }

    let res = {
        errMsg
    };
    fail && fail(res);
    complete && complete(res);
}

function initRequestEvents(xhr, options) {
    xhr.addEventListener(
        'load', processRequestDone.bind(xhr, options, {done: true})
    );
    xhr.addEventListener(
        'error', processRequestDone.bind(xhr, options, {error: true})
    );
    xhr.addEventListener(
        'timeout', processRequestDone.bind(xhr, options, {timeout: true})
    );
    xhr.addEventListener(
        'abort', processRequestDone.bind(xhr, options, {abort: true})
    );

    const {headerListeners} = options;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 2) {
            let headers = getResponseHeaders(xhr);
            headerListeners.forEach(callback => callback(headers));
        }
    };
}

function createRequester(options) {
    let {
        url,
        data, // string, object, ArrayBuffer
        header,
        method = 'GET',
        credentials
    } = options;
    method || (method = 'GET');
    method = method.toUpperCase();

    const contentType = getContentType(header);
    const reqInfo = getRequestUrlData(url, data, method, contentType);
    const xhr = new XMLHttpRequest();

    initRequestEvents(xhr, options);

    credentials && (xhr.withCredentials = true);

    // TODO: init using global app config `networkTimeout.request`
    // xhr.timeout = 5000;
    xhr.open(method, reqInfo.url, true);

    setRequestHeaders(xhr, header);
    xhr.send(reqInfo.data);

    return xhr;
}

export default {

    /**
     * Request network resource.
     *
     * @param {Object} options request options
     * @param {string} options.url the url to request
     * @param {string|Object=} options.data the request data, optional,
     *        `ArrayBuffer` is supported in weixin which is not supported in quick app.
     * @param {Object=} options.header the request header to set, optional
     * @param {string} options.method the request method
     * @param {string=} options.dataType the return data type, optional, by default
     *        `json`, it'll auto call `JSON.parse` to parse the response data and
     *         return object.
     * @param {string=} options.responseType the response data type, optional,
     *        by default `text`, other validated value: `arraybuffer`
     * @param {Function=} options.success the request success callback
     * @param {Function=} options.fail the request fail callback
     * @param {Function=} options.complete the request done callback whatever is
     *        success or fail.
     * @param {boolean=} options.credentials the extra h5 request options,
     *        whether or not cross-site Access-Control requests should be made
     *        using credentials
     * @return {RequestTask}
     */
    request(options) {
        const headerListeners = [];
        let requester = createRequester(Object.assign({}, options, {
            headerListeners
        }));
        return {
            abort() {
                requester.abort();
            },
            onHeadersReceived(callback) {
                headerListeners.push(callback);
            },
            offHeadersReceived(callback) {
                let idx = headerListeners.indexOf(callback);
                if (idx !== -1) {
                    headerListeners.splice(idx, 1);
                }
            }
        };
    }
};
