/**
 * @file The extend API of the quick app
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */

import prompt from '@system.prompt';
import router from '@system.router';
import {parseQuery} from '../util/url';

/**
 * Navigate to the specified url
 *
 * @param {Object} options the navigation options
 * @param {string} options.url the url to navigate to
 * @param {Object=} options.params the navigation params, which is not
 *        supported in weixin env
 */
function navigateTo(options) {
    let {url, params} = options;
    let queryIdx = url.indexOf('?');
    if (queryIdx !== -1) {
        let query = url.substr(queryIdx + 1);
        url = url.substring(0, queryIdx);

        if (query) {
            query = parseQuery(query);
            params = Object.assign({}, query, params);
        }
    }

    if (url.chartAt(0) === '/') {
        let urlParts = url.split('/');
        urlParts.pop(); // remove component name
        url = url.join('/');
    }

    router.push({
        url,
        params
    });
}

/**
 * The extension API definition which signature is refer to weixin API definition
 *
 * @type {Object}
 */
export default {

    /**
     * Show toast api
     *
     * @param {Object} options the options to showToast
     */
    showToast(options) {
        let opts = {};
        let {title, message, duration} = options;
        if (title && !message) {
            opts.message = title;
        }

        if (duration != null) {
            opts.duration = duration ? 1 : 0;
        }

        prompt.showToast(opts);
    },

    /**
     * Navigate back
     *
     * @param {Object=} options the navigation options
     * @param {number=} delta the navigation back page number
     * @return {*}
     */
    navigateBack(options) {
        if (!options) {
            return router.back();
        }

        let {delta} = options;
        if (delta) {
            let len = router.getLength();
            delta > len - 1 && (delta = len - 1);

            while (delta > 0) {
                delta--;
                router.back();
            }
        }
        else {
            return router.back();
        }
    },

    /**
     * Navigate to the specified url
     *
     * @param {Object} options the navigation options
     * @param {string} options.url the url to navigate to
     * @param {Object=} options.params the navigation params, which is not
     *        supported in weixin env
     */
    navigateTo,

    /**
     * Redirect to the specified url.
     * In quick app, it cannot close current page that is different from weixin.
     */
    redirectTo: navigateTo
};

