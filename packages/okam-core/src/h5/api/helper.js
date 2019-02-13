/**
 * @file The api helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Process the async api callback
 *
 * @param {string} apiName the async api name
 * @param {Function} api the sync api to execute
 * @param {Array} args the sync api execute args
 * @param {Object} options the async api execute options
 * @param {Function=} options.success the success callback when sync api execute successfully
 * @param {Function=} options.fail the fail callback when sync api execute fail
 * @param {Function=} options.complete the sync api execute done callback
 * @param {Function=} options.normalizeRes the custom callback response data normalization
 */
export function processAsyncApiCallback(apiName, api, args, options) {
    let {success, fail, complete, normalizeRes} = options || {};
    let errMsg = `${apiName}:`;
    try {
        let data = api.apply(null, args);
        errMsg += 'ok';
        let res = {};
        if (normalizeRes) {
            res = normalizeRes(data);
        }
        else {
            data !== undefined && (res = {data});
        }
        res.errMsg = errMsg;
        success && success(res);
        complete && complete(res);
    }
    catch (ex) {
        errMsg += 'fail ' + ex.toString();
        fail && fail({errMsg});
        complete && complete({errMsg});
    }
}
