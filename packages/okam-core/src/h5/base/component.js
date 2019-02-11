/**
 * @file The h5 app component base
 * @author sparklewhy@gmail.com
 */

'use strict';

/* global window:false */

import base from '../../base/base';
import {setDataByPath} from '../../helper/data';

export default {

    /**
     * The beforeCreate hook
     *
     * @private
     */
    beforeCreate() {
        let propDescriptors = {
            $app: {
                get() {
                    return window.__currOkamAppInstance;
                }
            }
        };
        Object.keys(base).forEach(k => {
            propDescriptors[k] = {
                get() {
                    return base[k];
                }
            };
        });

        Object.defineProperties(this, propDescriptors);

        /**
         * Create selector query basing global API, this API like the
         * createSelectorQuery defined in the native component context.
         *
         * @return {Object}
         */
        this.createSelectorQuery = () => this.$api.createSelectorQuery().in(this);
    },

        /**
     * The beforeMount hook
     *
     * @private
     */
    beforeMount() {
        // call wx component native lifecycle
        this.attached && this.attached();
    },

    /**
     * The mounted hook
     *
     * @private
     */
    mounted() {
        // call wx component native lifecycle
        this.ready && this.ready();
    },

    /**
     * The destroyed hook
     *
     * @private
     */
    destroyed() {
        this.$isDestroyed = true; // add destroyed flag
        // call wx component native lifecycle
        this.detached && this.detached();
    },

    methods: {

        /**
         * Providing weixin setData API
         *
         * @param {Object} pathInfo the data path info to set
         * @param {Function=} callback the callback when set data done
         */
        setData(pathInfo, callback) {
            setDataByPath(this, pathInfo);
            this.$nextTick(callback);
        }
    }
};
