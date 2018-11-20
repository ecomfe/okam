/**
 * @file Create App instance
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */

// import appBase from './base/application';
import {use, createApp} from './helper/factory';
import {definePropertyValue} from './util/index';
import base from './base/base';

/**
 * Register API
 *
 * @param {Object} apiConfig the api config to register
 */
function registerApi(apiConfig) {
    let baseApi = base.$api;
    apiConfig && Object.keys(apiConfig).forEach(k => {
        // TODO: when in dev mode, warn the existed API will be override
        definePropertyValue(baseApi, k, apiConfig[k]);
    });
}

/**
 * Create the app creator factory
 *
 * @param {Object} appBase the appBase
 * @param {Object=} extendApi the extension api to register
 * @return {Function}
 */
export default function createAppFactory(appBase, extendApi) {
    let creator = function (appInfo) {
        return createApp(appInfo, appBase);
    };

    registerApi(extendApi);

    creator.use = use;
    creator.registerApi = registerApi;

    return creator;
}
