/**
 * @file The login API of the H5 app
 * @author congpeisen
 */

'use strict';

/* global window */

import {extend, getQueryStr} from './util';

export default {

    /**
     * Jump to Baidu login
     *
     * @param {Object} userConf config
     */
    login(userConf = {}) {
        const host = 'https://wappass.baidu.com';
        const conf = extend({
            type: 1,
            params: {
                src: 'se_080000',
                from: 'common'
            },
            href: '',
            isReplaceUrl: false
        }, userConf);
        let query = {};
        query = extend(
            {
                tpl: 'smart_edu',
                extrajson: JSON.stringify(conf.params),
                u: conf.href
                    ? encodeURIComponent(window.location.origin + conf.href)
                    : encodeURIComponent(window.location.href)
            },
            conf.type === 2 ? {
                sms: 1
            } : {}
        );
        if (conf.href.indexOf('http') === 0) {
            query.u = encodeURIComponent(conf.href);
        }
        const url = host + '?' + getQueryStr(query);

        if (conf.isReplaceUrl) {
            window.location.replace(url);
        }
        else {
            window.location.href = url;
        }
    },

    /**
     * Judge login status
     *
     * @return {boolean} void
     */
    isLoginSync() {
        return false;
    }
};
