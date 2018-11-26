/**
 * @file Init api
 * @author sparklewhy@gmail.com
 */

'use strict';

import base from './base';
import {promisifyApis, interceptApis} from '../na/api';
import {api} from '../na/index';

function initPlatformInfo(callback) {
    api.getSystemInfo({
        success(info) {
            callback && callback(null, info);
        },
        fail(err) {
            callback && callback(err);
        }
    });
}

/**
 * Initialize promisify APIs and interception APIs.
 * Return false, if initialized.
 *
 * @param {Function=} callback init system info callback
 * @return {boolean}
 */
export default function initApis(callback) {
    if (!this.__apisInited) {
        // ensure platform info available afterwards
        initPlatformInfo((err, data) => {
            if (!err) {
                api.okam.setPlatformInfo(callback ? callback(data) : data);
            }
        });

        this.__apisInited = true;

        Object.assign(this, base);

        let promiseApis = this.$promisifyApis;
        let interceptAPis = this.$interceptApis;

        promisifyApis(promiseApis, this);
        interceptApis(interceptAPis, '$api', this);

        let reqApiInterceptOpts = interceptAPis && interceptAPis.request;
        if (reqApiInterceptOpts) {
            interceptApis({request: reqApiInterceptOpts}, '$http', this);
        }
        return true;
    }

    return false;
}
