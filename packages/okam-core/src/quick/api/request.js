/**
 * @file Request API
 * @author sparklewhy@gmail.com
 */

'use strict';

import fetch from '@system.fetch';

function normalizeResponseData(res, dataType) {
    let {code, data, headers} = res;
    if (!data) {
        return res;
    }

    if (dataType == null || dataType === 'json') {
        try {
            data = JSON.parse(data);
        }
        catch (ex) {
            // ignore exception
        }
    }
    return {data, statusCode: code, header: headers};
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
     * @param {string=} options.dataType the response data type, optional, by default
     *        `json`, it'll auto call `JSON.parse` to parse the response data and
     *         return object.
     * @param {Function=} options.success the request success callback
     * @param {Function=} options.fail the request fail callback
     * @param {Function=} options.complete the request done callback whatever is
     *        success or fail.
     * @return {*}
     */
    request(options) {
        let {url, data, header, method, dataType, success, fail, complete} = options;
        let toResInfo;
        let doneCallback = function (callback, res) {
            if (!toResInfo) {
                let resInfo = normalizeResponseData(res, dataType);
                toResInfo = resInfo;
            }

            callback && callback(toResInfo);
        };

        return fetch.fetch({
            url,
            data,
            header,
            method,
            fail,
            success: doneCallback.bind(null, success),
            complete: doneCallback.bind(null, complete)
        });
    }
};
