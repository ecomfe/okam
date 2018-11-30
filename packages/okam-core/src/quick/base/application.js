/**
 * @file The app base
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-camelcase */

import initApi from '../../base/init-api';
import {appGlobal} from '../env';

export default {

    /**
     * The hook when app create
     *
     * @private
     */
    onCreate() {
        initApi.call(this, systemInfo => {
            // cache platform info
            appGlobal.okam_platform_info = systemInfo;
            return systemInfo;
        });

        this.onLaunch && this.onLaunch();
        this.onShow && this.onShow();
    }
};

