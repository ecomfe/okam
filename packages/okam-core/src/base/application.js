/**
 * @file The app base
 * @author sparklewhy@gmail.com
 */

'use strict';

import base from './base';
import {promisifyApis, interceptApis} from '../na/api';
import {getApis, setApis} from '../na/api';

/**
 * Initialize promisify APIs and interception APIs.
 * Return false, if initialized.
 *
 * @inner
 * @return {boolean}
 */
function initApis() {
    if (!this.__apisInited) {
        this.__apisInited = true;

        let promiseApis = this.$promisifyApis;
        let interceptAPis = this.$interceptApis;

        let apis = getApis();
        if ((promiseApis && promiseApis.length)
            || (interceptAPis && Object.keys(interceptAPis).length)
        ) {
            // create new apis to ami to override existed apis
            apis = Object.assign({}, apis);
            setApis(apis);
        }
        this.$api = apis;

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

export default Object.assign({

    /**
     * The hook when app launch
     *
     * @private
     */
    onLaunch() {
        initApis.call(this);
    },

    /**
     * The hook when app show
     *
     * @private
     */
    onShow() {
        initApis.call(this);
    }
}, base);

