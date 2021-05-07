/**
 * @file The swan page base
 * @author liujiaor@gmail.com
 */

'use strict';
import {getCurrApp} from '../../na/index';
import base from '../../base/base';
import component from './component';
import pageBase from '../../base/page';

export default Object.assign({}, pageBase, component, {
    onPrefetch() {
        this.__isSupportOnPrefetch = true;
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
     * swan init done hook
     *
     * @private
     * @param {Object} query the page query params
     */
    onInit(query) {
        this.$isSupportOninit = true;
        this.$isPage = true;
        if (this.$isDefineThisProp) {
            return;
        }
        this.$query = query;
        if (!this.__isSupportOnPrefetch) {
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
        }
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
    methods: Object.assign({}, pageBase.methods)
});
