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
