/**
 * @file The quick app component base
 * @author sparklewhy@gmail.com
 */

'use strict';

import base from '../../base/base';
import {setDataByPath} from '../../helper/data';

export default {

    /**
     * Quick app init done hook
     *
     * @private
     */
    onInit() {
        this.created();
    },

    /**
     * Quick app ready hook
     *
     * @private
     */
    onReady() {
        this.attached();
        this.ready();
    },

    /**
     * Quick app destroy hook
     *
     * @private
     */
    onDestroy() {
        this.detached();
    },

    /**
     * The created hook when component is created
     *
     * @private
     */
    created() {
        let rawApp = this.$app;
        this.$rawApp = rawApp;
        Object.defineProperties(this, {
            $app: {
                get: () => this.$rawApp.$def,
                enumerable: true
            }
        });

        let propDescriptors = {};
        Object.keys(base).forEach(k => {
            if (k !== '$api') {
                propDescriptors[k] = {
                    get() {
                        return base[k];
                    }
                };
            }
        });
        Object.defineProperties(this, propDescriptors);

        // In quick app, required module may not be cached and the inner module
        // state cannot be persisted even if we have changed its inner state
        // during app lifetime.
        // As for we need to register API and change API dynamically when startup.
        // So, we get the global API must be from the global app instance.
        this.$api = rawApp.$api;

        // call beforeCreate hook
        this.beforeCreate && this.beforeCreate();
    },

    /**
     * The attached hook when component is attached
     *
     * @private
     */
    attached() {
        // call beforeMount hook
        this.beforeMount && this.beforeMount();
    },

    /**
     * The ready hook when component is ready
     *
     * @private
     */
    ready() {
        // call mounted hook
        this.mounted && this.mounted();
    },

    /**
     * The detach hook when the component is detached
     *
     * @private
     */
    detached() {
        // call beforeDestroy hook
        this.beforeDestroy && this.beforeDestroy();

        this.$isDestroyed = true; // add destroyed flag

        // call destroyed hook
        this.destroyed && this.destroyed();
    },

    methods: {

        /**
         * Select custom component
         *
         * @param {string} id the component id or id selector begin with `#`
         * @return {Object}
         */
        selectComponent(id) {
            if (id.charAt(0) === '#') {
                id = id.substr(1);
            }

            return this.$child(id);
        },

        /**
         * Add the handler for the given event name. The handler will be only triggered
         * once, after trigger once, the listener will be automatically removed.
         *
         * @param {*} eventName the event name to listen
         * @param {*} handler the event handler
         */
        $once(eventName, handler) {
            let onceHandler = function (...args) {
                this.$off(eventName, onceHandler);
                onceHandler = null;

                handler.apply(this, args);
            };
            this.$on(eventName, onceHandler);
        },

        /**
         * Providing weixin setData API
         *
         * @param {Object} pathInfo the data path info to set
         * @param {Function=} callback the callback when set data done
         */
        setData(pathInfo, callback) {
            setDataByPath(this, pathInfo);

            // simulate the callback execution when the set data done
            Promise.resolve().then(callback);
        }
    }
};
