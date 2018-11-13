/**
 * @file Native api utilities
 * @author sparklewhy@gmail.com
 */

import {isFunction, isObject, isPromise, definePropertyValue} from '../util/index';

/**
 * Promisify the given function.
 * Notice: the function must be async function and the the first param passed to
 * the function must be like the below:
 * <code>
 * func({
 *    fail() {}, // execute async function fail callback
 *    success() {} // execute async function success callback
 * });
 * </code>
 *
 * @param {Function} func the function to been promisify
 * @param {Object=} context the context to execute the promisified function
 * @return {Function}
 */
export function promisify(func, context = null) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            let opts = Object.assign({}, args[0]);
            args[0] = opts;

            let oldFail = opts.fail;
            opts.fail = err => {
                typeof oldFail === 'function' && oldFail(err);
                reject(err);
            };

            let oldSuccess = opts.success;
            opts.success = res => {
                typeof oldSuccess === 'function' && oldSuccess(res);
                resolve(res);
            };

            func.apply(context || null, args);
        });
    };
}

/**
 * promisifyApi
 *
 * @param {Array|string} apis apis which need promisifyApi
 * @param {Object=} context the context to execute the promisified function
 */
export function promisifyApis(apis, context) {
    if (!Array.isArray(apis)) {
        apis = [apis];
    }

    let allApis = context.$api;
    apis.forEach(key => {
        let api = allApis[key];

        if (!api) {
            return;
        }

        definePropertyValue(allApis, key, promisify(api, context.$api));
    });
}

function proxyAPI(ctx, rawApi, apiOpts, ...args) {
    let {init, done} = apiOpts;

    if (isFunction(init)) {
        let isArrArgs = false;
        if (args.length > 1 || !isObject(args[0])) {
            // convert as one array type argument to make the developer
            // can modify the call arguments directly
            args = [args];
            isArrArgs = true;
        }
        init.apply(this, [...args, ctx]);

        // restore args type
        args = isArrArgs ? args[0] : args;
    }

    let result = rawApi.apply(this, args);
    if (isFunction(done)) {
        if (isPromise(result)) {
            result = result.then(
                res => {
                    let data = done(null, res, ctx);
                    data == null || (res = data);
                    return res;
                },
                err => done(err || /* istanbul ignore next */ 'error', null, ctx)
            );
        }
        else {
            result = done(null, result, ctx);
        }
    }

    return result;
}

/**
 * Intercept native api to change the call arguments or the call result or
 * log something when calling.
 *
 * @param {Object} apis the api to intercept, the structure is like below:
 *        {
 *            request: { // the key `request` is the API name to intercept
 *
 *                // Intercept the call, in this hook you can change the call arguments
 *                init(options) {
 *                    // modify request options
 *                    options.dataType = 'json';
 *                },
 *
 *                // Intercept the API return result, in this hook you can
 *                // change the return result.
 *                // The first argument means whether the call has error happen,
 *                // if the `err` is null, the call is successful, `res` the result
 *                // of this call.
 *                // NOTICE: this hook is used for the sync API or async API that
 *                // must return promise, if you wanna to modify call result.
 *                // For async API that returns promise, if you wanna the promise
 *                // reject happen, you need throw `err` in this hook.
 *                done(err, res) {
 *                    if (err) {
 *                        // log something
 *                        throw err; // ensure the reject can trigger like before.
 *                    }
 *                    res.data = res.data.data; // modify the return data structure.
 *
 *                    // return 333; // of course, you can return the new result,
 *                    // if the `res` is not a reference, you cannot change it directly.
 *                }
 *            }
 *        }
 * @param {string} key the key of all raw api definition
 * @param {Object} ctx the app instance context
 */
export function interceptApis(apis, key, ctx) {
    if (!apis) {
        return;
    }

    let allApis = ctx[key];
    Object.keys(apis).forEach(apiName => {
        let rawApi = allApis[apiName];
        if (rawApi) {
            definePropertyValue(
                allApis,
                apiName,
                proxyAPI.bind(null, ctx, rawApi, apis[apiName])
            );
        }
    });
}
