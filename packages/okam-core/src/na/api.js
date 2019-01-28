/**
 * @file Native api utilities
 * @author sparklewhy@gmail.com
 */

import {isFunction, isObject, isPromise, definePropertyValue} from '../util/index';

/**
 * Crate API done hook
 *
 * @inner
 * @param {Function} done the done hook to execute
 * @param {Object} ctx the extra call context for the hook
 * @return {Object}
 */
function createAPIDoneHook(done, ctx) {
    let hookInfo = {
        resData: null,
        resException: false,
        hook: null
    };

    hookInfo.hook = (err, res, complete, shouldCatchException) => {
        let result;
        if (err != null) {
            result = err;
            if (shouldCatchException) {
                try {
                    let data = done(result, null, ctx);
                    data == null || (result = data);
                }
                catch (ex) {
                    // cache exception info for promise
                    hookInfo.resException = true;
                    result = ex;
                }
            }
            else {
                let data = done(result, null, ctx);
                data == null || (result = data);
            }
        }
        else {
            let data = done(null, res, ctx);
            data == null || (res = data);
            result = res;
        }

        // cache response data for promise
        hookInfo.resData = result;

        complete && complete(result); // call complete callback

        return result;
    };

    return hookInfo;
}

/**
 * Intercept async API done based on the call arguments: `success`/`fail`
 *
 * @inner
 * @param {boolean} sync whether is sync API, if true, it will not hook the
 *        API done result based the call arguments
 * @param {Array} args the API call arguments
 * @param {Function} doneHook the done hook to execute
 * @return {boolean} whether intercept the API done result by the arguments
 */
function interceptAsyncAPIDone(sync, args, doneHook) {
    let callOpts = args[0];
    let {success, fail, complete} = callOpts || {};
    let hasIntercepted = false;

    if (!sync
        && (isFunction(success) || isFunction(fail) || isFunction(complete))
    ) {
        hasIntercepted = true;
        let newCallOpts = Object.assign({}, callOpts);
        newCallOpts.success = res => {
            let data = doneHook(null, res, complete, true);
            success && success(data);
        };

        newCallOpts.fail = err => {
            err = doneHook(err || /* istanbul ignore next */ 'err', null, complete, true);
            fail && fail(err);
        };

        // remove complete callback
        // using success and fail callback instead of using complete callback
        complete && (newCallOpts.complete = undefined);
        args[0] = newCallOpts;
    }

    return hasIntercepted;
}

/**
 * Intercept the API promise response
 *
 * @inner
 * @param {boolean} hasIntercepted whether intercepted by the API call arguments
 * @param {Promise} promise the promise response
 * @param {Object} doneHookInfo the done hook info
 * @return {Promise}
 */
function interceptPromiseResponse(hasIntercepted, promise, doneHookInfo) {
    let {hook} = doneHookInfo;
    return promise.then(
        res => (hasIntercepted ? doneHookInfo.resData : hook(null, res)),
        err => {
            // check whether is intercepted to avoid repeated interception
            if (hasIntercepted) {
                let {resException, resData} = doneHookInfo;
                if (resException) {
                    throw resData;
                }
                return resData;
            }

            return hook(err || /* istanbul ignore next */ 'err');
        }
    );
}

/**
 * Execute API initialization hook
 *
 * @inner
 * @param {Function} init the initialization hook
 * @param {Array} args the API call arguments
 * @param {Object} ctx the extra call context for the hook
 * @return {*}
 */
function hookAPIInit(init, args, ctx) {
    // API init interception
    if (isFunction(init)) {
        if (args.length > 1 || !isObject(args[0])) {
            // convert as one array type argument to make the developer
            // can modify the call arguments directly
            args = [args];
        }
        return init.apply(this, [...args, ctx]);
    }
}

/**
 * Execute API done hook
 *
 * @inner
 * @param {Function} done the done hook
 * @param {boolean} sync whether is sync API, if true, it will not hook the
 *        API done result based the call arguments
 * @param {Array} args the API call arguments
 * @param {Object} ctx the extra call context for the hook
 * @return {Object} return the api done hook info
 */
function hookAPIDone(done, sync, args, ctx) {
    // API done interception
    let hasDoneHook = isFunction(done);
    let hasIntercepted = false;
    let doneHookInfo;
    if (hasDoneHook) {
        doneHookInfo = createAPIDoneHook(done, ctx);
        // intercept async API based the args: `success`/`fail`/`complete` callback
        hasIntercepted = interceptAsyncAPIDone(sync, args, doneHookInfo.hook);
    }

    return {
        hasDoneHook,
        hasIntercepted,
        doneHookInfo
    };
}

/**
 * Execute api
 *
 * @inner
 * @param {Object} hookInfo the api done hook info
 * @param {Function} rawApi the raw api definition
 * @param {Array} args the API call arguments
 * @return {*}
 */
function executeAPI(hookInfo, rawApi, args) {
    // call API
    let {hasDoneHook, hasIntercepted, doneHookInfo} = hookInfo;
    let result = rawApi.apply(this, args);
    if (hasDoneHook) {
        // intercept the API call result
        if (isPromise(result)) {
            result = interceptPromiseResponse(hasIntercepted, result, doneHookInfo);
        }
        else if (!hasIntercepted) {
            result = doneHookInfo.hook(null, result);
        }
    }

    return result;
}

/**
 * Proxy API
 *
 * @inner
 * @param {Object} ctx the extra context information for the hook
 * @param {Function} rawApi the original API to call
 * @param {Object} apiOpts the API hook options
 * @param  {...any} args the arguments to call the API
 * @return {*}
 */
function proxyAPI(ctx, rawApi, apiOpts, ...args) {
    let {init, done, sync} = apiOpts;

    // API init interception
    let initResult = hookAPIInit(init, args, ctx);

    if (isPromise(initResult)) {
        return initResult.then(
            () => {
                let hookInfo = hookAPIDone(done, sync, args, ctx);
                return executeAPI(hookInfo, rawApi, args);
            }
        );
    }
    else {
        let hookInfo = hookAPIDone(done, sync, args, ctx);
        return executeAPI(hookInfo, rawApi, args);
    }
}

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
