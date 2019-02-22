/**
 * @file Phone API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */

import {processAsyncApiCallback} from './helper';

export default {

    /**
     * Make phone call
     *
     * @param {Object} options the options to set
     * @param {string} options.phoneNumber the phone number to dial
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    makePhoneCall(options) {
        let {phoneNumber} = options;
        processAsyncApiCallback(
            'makePhoneCall',
            () => {
                window.location = 'tel:' + phoneNumber;
            },
            [], options
        );
    }
};
