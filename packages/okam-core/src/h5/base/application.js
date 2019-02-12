/**
 * @file The h5 app base
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */
/* eslint-disable fecs-camelcase */

import Vue from 'vue';
import VueRouter from 'vue-router';
import initApi from '../../base/init-api';
import bindVisibilityChange from '../util/visibility';
import bindUnCatchException from '../util/error';

Vue.use(VueRouter);

export default {

    beforeCreate() {
        // cache the current app instance for getCurrApp API usage
        window.__currOkamAppInstance = this;

        // hook all application definition options on the instance
        let opts = this.$options;
        Object.keys(opts).forEach(k => {
            if (this[k] === undefined) {
                this[k] = opts[k];
            }
        });

        // bind error
        this.onError && bindUnCatchException(this.onError);

        // init extension api
        initApi.call(this);

        // inject router instance
        const initRouterInstance = this.$api._initRouterInstance;
        initRouterInstance && initRouterInstance(this.$router);

        // init onShow/onHide listener
        this.__removeVisibilityChange = bindVisibilityChange(isHide => {
            if (isHide) {
                this.onHide && this.onHide();
            }
            else {
                this.onShow && this.onShow();
            }
        });

        // execute onLaunch & onShow
        this.onLaunch && this.onLaunch();
        this.onShow && this.onShow();
    },

    beforeDestroy() {
        let handler = this.__removeVisibilityChange;
        handler && handler();
        window.__currOkamAppInstance = null;
    }
};

