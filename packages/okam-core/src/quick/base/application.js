/**
 * @file The app base
 * @author sparklewhy@gmail.com
 */

'use strict';

import initApi from '../../base/init-api';

export default {

    /**
     * The hook when app create
     *
     * @private
     */
    onCreate() {
        initApi.call(this);
    }
};

