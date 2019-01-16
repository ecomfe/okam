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
        if (typeof this.$appOptions === 'function') {
            this.$appOptions = this.$appOptions();
        }

        let changedPagePathMap = this.$appOptions
            && this.$appOptions.changedPagePathMap;
        // fix page router url
        if (changedPagePathMap) {
            let navigateTo = this.$api.navigateTo;
            this.$api.navigateTo = function (options) {
                let {url} = options || {};
                let newUrl = url && changedPagePathMap[url];
                if (newUrl) {
                    options = Object.assign({}, options, {url: newUrl});
                }
                return navigateTo(options);
            };
            this.$api.redirectTo = this.$api.navigateTo;
        }

        this.onLaunch && this.onLaunch();
    }
};

