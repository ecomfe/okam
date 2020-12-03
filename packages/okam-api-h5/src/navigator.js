/**
 * @file Navigator API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global document:false */

import {processAsyncApiCallback} from './helper';

export default {

    /**
     * Set navigator bar title
     *
     * @param {Object} options the options to set
     * @param {string} options.title the title to set
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    setNavigationBarTitle(options) {
        let {title} = options;
        processAsyncApiCallback(
            'setNavigationBarTitle',
            () => {
                document.title = title;
            },
            [], options
        );
    }
};
