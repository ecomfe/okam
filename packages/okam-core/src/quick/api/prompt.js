/**
 * @file The prompt API of the quick app
 * @author sparklewhy@gmail.com
 */

'use strict';

import prompt from '@system.prompt';

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
    }
};

