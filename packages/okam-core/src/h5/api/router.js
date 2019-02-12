/**
 * @file The router API for the H5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */

import {parseQuery} from '../../util/url';

/* eslint-disable fecs-camelcase */
let _routerInstance = null;

/**
 * Navigate to the specified url
 *
 * @param {Object} options the navigation options
 */
function navigateTo(options) {
    let {url, success, complete, fail} = options;
    let queryIdx = url.indexOf('?');
    let path = url;
    let query;
    if (queryIdx !== -1) {
        query = url.substr(queryIdx + 1);
        path = url.substring(0, queryIdx);

        if (query) {
            query = parseQuery(query);
        }
    }

    _routerInstance.push({
        path,
        query
    }, () => {
        success && success();
        complete && complete();
    }, fail);
}

export default {

    /**
     * Init router instance
     *
     * @param {Router} router the vue router instance
     */
    _initRouterInstance(router) {
        _routerInstance = router;
    },

    /**
     * Navigate back
     *
     * @param {Object=} options the navigation options
     * @param {number=} delta the navigation back page number
     */
    navigateBack(options) {
        const router = _routerInstance;
        if (!options) {
            router.back();
        }
        else {
            let {delta} = options;
            if (delta) {
                router.go(-1 * delta);
            }
            else {
                router.back();
            }
        }
    },

    /**
     * Navigate to the specified url
     *
     * @param {Object} options the navigation options
     * @param {string} options.url the url to navigate to
     * @param {Function=} options.success the navigation successful callback
     * @param {Function=} options.complete the navigation done callback
     * @param {Function=} options.fail the navigation fail callback
     */
    navigateTo,

    /**
     * Redirect to the specified url.
     */
    redirectTo: navigateTo
};
