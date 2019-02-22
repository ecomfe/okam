/**
 * @file The api helper
 * @author sparklewhy@gmail.com
 */

'use strict';

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
 *     _spread: true, // spread
 *     complete(res) {
 *         // res: {a: 3, errMsg: 'test:ok'}
 *     }
 * });
 *
 * processAsyncApiCallback('test', api, [], {
 *     _spread(res) { // custom format
 *        return {myData: res};
 *     },
 *     complete(res) {
 *         // res: {myData: {a: 3}, errMsg: 'test:ok'}
 *     }
 * });
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
 * @param {Function|Boolean=} options._spread the custom response data normalization
 */
export function processAsyncApiCallback(apiName, api, args, options) {
    /* eslint-disable fecs-camelcase */
    let {success, fail, complete, _spread} = options || {};
    let errMsg = `${apiName}:`;
    try {
        let data = api.apply(null, args);
        errMsg += 'ok';

        let res = {};
        if (_spread) {
            if (typeof _spread === 'function') {
                res = _spread(data);
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
    catch (ex) {
        errMsg += 'fail ' + ex.toString();
        fail && fail({errMsg});
        complete && complete({errMsg});
    }
}
