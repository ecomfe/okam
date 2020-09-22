/**
 * @file The router API for the H5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */

import {parseQuery} from './util/url';

/* eslint-disable fecs-camelcase */
let _routerInstance = null;

/**
 * Navigate to the specified url
 *
 * @param {Object} options the navigation options
 * @param {string} options.url the url to navigate to
 * @param {Function=} options.success the navigation successful callback
 * @param {Function=} options.complete the navigation done callback
 * @param {Function=} options.fail the navigation fail callback
 * @param {string=} options.replaced it navigates without pushing a new history entry
 */
function navigateTo(options = {}) {
    let {
        url,
        success,
        complete,
        fail,
        replaced
    } = options;

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

    const routerAction = replaced ? _routerInstance.replace : _routerInstance.push;

    routerAction.call(_routerInstance, {
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
    navigateBack(options = {}) {
        const router = _routerInstance;

        const delta = options.delta || 1;
        router.go(-delta);
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
     * Switch tab
     */
    switchTab: navigateTo,

    /**
     * Redirect to the specified url
     *
     * @param {Object} options the navigation options
     * @param {string} options.url the url to navigate to
     * @param {Function=} options.success the navigation successful callback
     * @param {Function=} options.complete the navigation done callback
     * @param {Function=} options.fail the navigation fail callback
     */
    redirectTo(options = {}) {
        options.replaced = true;
        navigateTo.call(this, options);
    },

    /**
     * reLaunch the specified url
     * @param {Object} options the navigation options
     * @param {string} options.url the url to navigate to
     * @param {Function=} options.success the navigation successful callback
     * @param {Function=} options.complete the navigation done callback
     * @param {Function=} options.fail the navigation fail callback
     */
    reLaunch(options = {}) {
        options.replaced = true;
        navigateTo.call(this, options);
    }
};
