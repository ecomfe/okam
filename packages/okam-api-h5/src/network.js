/**
 * @file The network API of the h5 app
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
 * @see https://caniuse.com/#feat=netinfo
 * @see https://caniuse.com/#feat=online-status
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global navigator:false */
/* global window:false */

import {processAsyncApiCallback} from './helper';

function getConnection() {
    return navigator.connection || navigator.webkitConnection;
}

/**
 * Get network type sync.
 * Return the validated network type: wifi/2g/3g/4g/unknown/none
 *
 * @return {string}
 */
function getNetworkTypeSync() {
    let networkType;
    if (navigator.onLine === false) {
        networkType = 'none';
    }
    else {
        let connection = getConnection();
        if (connection) {
            let type = connection.type;
            if (type && ['none', 'wifi', 'unknown'].indexOf(type) !== -1) {
                networkType = type;
            }
            else {
                networkType = connection.effectiveType;
                if (networkType === 'slow-2g') {
                    networkType = '2g';
                }
            }
        }
    }

    return {
        networkType: networkType || 'unknown'
    };
}

export default {

    /**
     * Get network type
     *
     * @param {Object} options the options to get
     * @param {Function=} options.success the success callback
     * @param {Function=} options.fail the fail callback
     * @param {Function=} options.complete the done callback whatever is
     *        success or fail.
     */
    getNetworkType(options) {
        /* eslint-disable fecs-camelcase */
        let opts = Object.assign({_spread: true}, options);
        processAsyncApiCallback(
            'getNetworkType',
            getNetworkTypeSync,
            [], opts
        );
    },

    /**
     * Listen network status change
     *
     * @param {Function} callback the status change callback to execute
     */
    onNetworkStatusChange(callback) {
        let handleChange = () => {
            let networkType = getNetworkTypeSync().networkType;
            let isConnected = networkType !== 'none';
            callback({networkType, isConnected});
        };

        let connection = getConnection();
        if (connection) {
            connection.addEventListener('change', handleChange);
        }
        else if (typeof navigator.onLine === 'boolean') {
            window.addEventListener('offline', handleChange);
            window.addEventListener('online', handleChange);
        }
    }
};
