/**
 * @file The app base
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-camelcase */

import initApi from '../../base/init-api';

export default {

    /**
     * The hook when app create
     *
     * @private
     */
    onCreate() {
        initApi.call(this);

        this.onLaunch && this.onLaunch();
        this.onShow && this.onShow();
    }
};

