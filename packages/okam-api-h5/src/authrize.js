/**
 * @file Authorization API for H5 App
 * @author Magicchewl@gmail.com
 */

import {callback} from './util';

export default {

    /**
     * authorization API
     *
     * @param {Object} options the options
     * @param {string} options.scope the scope you want to authorize
     * @param {Function} options.success the success callback
     * @param {Function} options.fail the fail callback
     * @param {Function} options.complete the complete callback
     */
    authorize(options = {}) {
        const {
            success,
            complete
        } = options;
        callback(success);
        callback(complete);
    },

    /**
     * openSetting Api
     */
    openSetting() {
        throw new Error('openSetting is not supported in web');
    },

    /**
     * getSetting API, all authrizations are returned true as default value
     *
     * @param {Function} options.success the success callback
     * @param {Function} options.fail the fail callback
     * @param {Function} options.complete the complete callback
     */
    getSetting(options = {}) {
        const {
            success
        } = options;

        /* eslint-disable fecs-valid-map-set */
        const authSetting = {
            'scope.userLocation': true,
            'scope.userInfo': true,
            'scope.address': true,
            'scope.invoiceTitle': true,
            'scope.writePhotosAlbum': true,
            'scope.camera': true,
            'scope.record': true
        };
        callback(success, {authSetting});
    }
};
