/**
 * @file Create App instance
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */

import {use, createApp} from './helper/factory';
import {definePropertyValue} from './util/index';
import base from './base/base';

/**
 * Register API
 *
 * @param {Object} apiConfig the api config to register
 * @param {boolean=} override whether override the all api definition
 */
function registerApi(apiConfig, override) {
    let apis = base.$api;
    if (override) {
        Object.assign(apis, apiConfig);
    }
    else {
        apiConfig && Object.keys(apiConfig).forEach(k => {
            definePropertyValue(apis, k, apiConfig[k]);
        });
    }
}

/**
 * Create the app creator factory
 *
 * @param {Object} appBase the appBase
 * @return {Function}
 */
export default function createAppFactory(appBase) {
    let creator = function (appInfo, options) {
        return createApp(appInfo, appBase, options);
    };

    creator.use = use;
    creator.registerApi = registerApi;

    return creator;
}
