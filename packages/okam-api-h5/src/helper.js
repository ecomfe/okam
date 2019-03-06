/**
 * @file The api helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Execute async api callback
 *
 * @param {string} apiName the async api name
 * @param {Object} options the async api execute options
 * @param {Function=} options.success the success callback when sync api execute successfully
 * @param {Function=} options.fail the fail callback when sync api execute fail
 * @param {Function=} options.complete the sync api execute done callback
 * @param {?err} err the err info when execute async api fail
 * @param {?*} data the async api response data
 * @param {Function|Boolean=} spread the custom response data normalization
 */
export function execAsyncApiCallback(apiName, options, err, data, spread) {
    let errMsg = `${apiName}:`;
    let isFail = err != null;
    errMsg += (isFail ? 'fail' : 'ok');
    err && (errMsg += ' ' + err);

    /* eslint-disable fecs-camelcase */
    let {success, fail, complete} = options || {};
    if (isFail) {
        let res = {errMsg};
        fail && fail(res);
        complete && complete(res);
        return;
    }

    let res = {};
    if (spread) {
        if (typeof spread === 'function') {
            res = spread(data);
        }
        else {
            res = data;
        }
    }
    else {
        data !== undefined && (res = {data});
    }

    res.errMsg = errMsg;
    success && success(res);
    complete && complete(res);
}

/**
 * Process the async api callback
 *
 * E.g.,
 * <code>
 * let api = () => {return {a: 3}};
 * processAsyncApiCallback('test', api, [], {
 *     complete(res) {
 *         // res: {data: {a: 3}, errMsg: 'test:ok'}
 *     }
 * });
 *
 * processAsyncApiCallback('test', api, [], {
 *     complete(res) {
 *         // res: {a: 3, errMsg: 'test:ok'}
 *     }
 * }, true); // spread
 *
 * processAsyncApiCallback('test', api, [], {
 *     complete(res) {
 *         // res: {myData: {a: 3}, errMsg: 'test:ok'}
 *     }
 * }, res => {return {myData: res}}); // custom format
 * </code>
 *
 *
 * @param {string} apiName the async api name
 * @param {Function} api the sync api to execute
 * @param {Array} args the sync api execute args
 * @param {Object} options the async api execute options
 * @param {Function=} options.success the success callback when sync api execute successfully
 * @param {Function=} options.fail the fail callback when sync api execute fail
 * @param {Function=} options.complete the sync api execute done callback
 * @param {Function|Boolean=} spread the custom response data normalization
 * @return {*}
 */
export function processAsyncApiCallback(apiName, api, args, options, spread) {
    let err = null;
    let data;
    try {
        data = api.apply(null, args);
    }
    catch (ex) {
        err = ex.toString();
    }

    execAsyncApiCallback(apiName, options, err, data, spread);
    return data;
}
