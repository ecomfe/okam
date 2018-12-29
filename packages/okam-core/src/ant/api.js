/**
 * @file The extend API of the ant mini program
 * @author sparklewhy@gmail.com
 */

/* global my:false */
'use strict';

import {definePropertyValue} from '../util/index';

const adaptedAPI = {

    /**
     * Show toast api
     *
     * @param {Object} options the options to showToast
     * @return {*}
     */
    showToast(options) {
        // normalize the options, fix the difference of the options between
        // weixin/swan and ant
        let {title, icon, content, type} = options;
        if (title && !content) {
            options.content = title;
        }

        if (icon && !type) {
            options.type = icon;
        }

        return my.showToast(options);
    },

    /**
     * Get system information async.
     * Add missing sdk version info to response information
     *
     * @param {Object} options the options
     * @param {Function=} options.success the request success callback
     * @param {Function=} options.fail the request fail callback
     * @param {Function=} options.complete the request done callback whatever is
     * @return {*}
     */
    getSystemInfo(options) {
        let formatData = function (res) {
            res.SDKVersion = my.SDKVersion;
        };

        let opts = Object.assign({}, options);
        let {success: oldSuccess, complete: oldComplete} = opts;
        oldSuccess && (opts.success = res => {
            formatData(res);
            oldSuccess(res);
        });
        oldComplete && (opts.complete = res => {
            if (res && typeof res === 'object' && res.version) {
                formatData(res);
            }
            oldComplete(res);
        });
        return my.getSystemInfo(opts);
    },

    /**
     * Get system information sync.
     * Add missing sdk version info to response information
     *
     * @return {Object}
     */
    getSystemInfoSync() {
        let res = my.getSystemInfoSync();
        if (res && typeof res === 'object' && res.version) {
            res.SDKVersion = my.SDKVersion;
        }

        return res;
    },

    /**
     * Setting navigation bar title
     *
     * @param {Object} options the options
     * @param {string} options.title the nav bar title to set
     * @param {Function=} options.success the request success callback
     * @param {Function=} options.fail the request fail callback
     * @param {Function=} options.complete the request done callback whatever is
     * @return {*}
     */
    setNavigationBarTitle(options) {
        return my.setNavigationBar(options);
    }
};

const api = Object.create(my);

Object.keys(adaptedAPI).forEach(k => {
    definePropertyValue(api, k, adaptedAPI[k]);
});

export default api;
