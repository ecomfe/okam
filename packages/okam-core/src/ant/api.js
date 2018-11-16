/**
 * @file The extend API of the ant mini program
 * @author sparklewhy@gmail.com
 */

'use strict';

import {env} from '../na/index';

export default {

    /**
     * Show toast api
     *
     * @param {Object} options the options to showToast
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

        env.showToast(options);
    }
};
