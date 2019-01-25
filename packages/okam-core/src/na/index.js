/**
 * @file The mini program global API/object
 * @author sparklewhy@gmail.com
 */

'use strict';

// NOTICE: After build, this file content will be replaced by the specified app env
//  module, like the following statement
// export * from '../quick/env';

let appEnv = {};
let appGlobal = {};
let api = {
    request(...args) {
        // only for test
        if (typeof global === 'object' && global && global.fakeRequest) {
            return global.fakeRequest.apply(this, args);
        }
    }
};
let getAppApi = () => {};
let getPagesApi = () => {};

/**
 * Setting the export env info for test purpose
 *
 * @param {Object} env the app env
 */
export function setExportInfo(env) {
    appEnv = env.appEnv;
    appGlobal = env.appGlobal;
    api = env.api;
    getAppApi = env.getCurrApp;
    getPagesApi = env.getCurrPages;
}

/* eslint-disable fecs-export-on-declare */
export {
    appEnv,
    appGlobal,
    api
};

/**
 * Get current app instance
 *
 * @return {Object}
 */
export function getCurrApp() {
    return getAppApi && getAppApi();
}

/**
 * Get current opened pages stack
 *
 * @return {Array}
 */
export function getCurrPages() {
    return getPagesApi && getPagesApi();
}
