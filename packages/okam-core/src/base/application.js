/**
 * @file The app base
 * @author sparklewhy@gmail.com
 */

'use strict';

import initApi from './init-api';

export default {

    /**
     * The hook when app launch
     *
     * @private
     */
    onLaunch() {
        initApi.call(this);
    },

    /**
     * The hook when app show
     *
     * @private
     */
    onShow() {
        initApi.call(this);
    }
};

