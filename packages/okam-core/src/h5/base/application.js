/**
 * @file The h5 app base
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-camelcase */

import initApi from '../../base/init-api';
import bindVisibilityChange from '../util/visibility';
import bindUnCatchException from '../util/error';

export default {

    beforeCreate() {
        this.onError && bindUnCatchException(this.onError);

        initApi.call(this);
        this.onLaunch && this.onLaunch();

        this.__removeVisibilityChange = bindVisibilityChange(isHide => {
            if (isHide) {
                this.onHide && this.onHide();
            }
            else {
                this.onShow && this.onShow();
            }
        });
    },

    beforeDestroy() {
        let handler = this.__removeVisibilityChange;
        handler && handler();
    }
};

