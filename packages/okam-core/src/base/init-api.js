/**
 * @file Init api
 * @author sparklewhy@gmail.com
 */

'use strict';

import base from './base';
import {promisifyApis, interceptApis} from '../na/api';
import {api} from '../na/index';
import * as platform from '../na/platform';

/**
 * Initialize promisify APIs and interception APIs.
 * Return false, if initialized.
 *
 * @return {boolean}
 */
export default function initApis() {
    if (!this.__apisInited) {
        // ensure platform info available afterwards
        Object.assign(api.okam, platform);
        api.okam.initPlatformInfo();

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
