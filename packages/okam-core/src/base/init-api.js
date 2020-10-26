/**
 * @file Init api
 * @author sparklewhy@gmail.com
 */

'use strict';

import base from './base';
import {promisifyApis, interceptApis} from '../na/api';

/**
 * Initialize promisify APIs and interception APIs.
 * Return false, if initialized.
 *
 * @return {boolean}
 */
export default function initApis() {
    if (!this.__apisInited) {
        this.__apisInited = true;

        Object.assign(this, base);

        let interceptAPis = this.$interceptApis;
        let reqApiInterceptOpts = interceptAPis && interceptAPis.request;
        // here visit $http.request to ensure the request init ahead of time
        if (this.$http.request && reqApiInterceptOpts) {
            interceptApis({request: reqApiInterceptOpts}, '$http', this);
        }

        let promiseApis = this.$promisifyApis;
        promisifyApis(promiseApis, this);
        interceptApis(interceptAPis, '$api', this);

        return true;
    }

    return false;
}
