/**
 * @file The swan page base
 * @author liujiaor@gmail.com
 */

'use strict';
import {getCurrApp} from '../../na/index';
import base from '../../base/base';
import component from './component';

export default Object.assign({}, component, {

    /**
     * swan init done hook
     *
     * @private
     * @param {Object} query the page query params
     */
    onInit(query) {
        this.$isSupportOninit = true;
        this.$isPage = true;
        this.$query = query;

        let propDescriptors = {
            $app: {
                get() {
                    return getCurrApp();
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
    },

    /**
     * The onLoad hook triggered when page on load.
     *
     * @private
     * @param {Object} query the page query params
     */
    onLoad(query) {
        // Compatible with the situation that low version OnInit does not exist
        if (!this.$isSupportOninit) {
            this.$isPage = true;
            this.$query = query || {};
        }

        /**
         * Create selector query basing global API, this API like the
         * createSelectorQuery defined in the native component context.
         *
         * @return {Object}
         */
        if (!this.createSelectorQuery) {
            this.createSelectorQuery = () => this.$api.createSelectorQuery();
        }

        // call component create life cycle method
        this.created();
    },

    /**
     * The ready hook triggered when paged is ready.
     *
     * @private
     */
    onReady() {
        // call component attached/ready life cycle method
        this.attached();
        this.ready();
    },

    /**
     * The unload hook triggered when page is unload.
     *
     * @private
     */
    onUnload() {
        // call component detach life cycle method
        this.detached();
    },

    methods: Object.assign(
        {
            // cannot define createSelectorQuery here, in weixin 2.1.3 sdk will
            // leading to error
        }, component.methods
    )
});
