/**
 * @file The quick app component base
 * @author sparklewhy@gmail.com
 */

'use strict';

import base from '../../base/base';

function selectElement(path) {
    if (path && path.charAt(0) === '#') {
        path = path.substr(1);
    }

    // only support id selector
    return this.$element(path);
}

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
            propDescriptors[k] = {
                get() {
                    return base[k];
                }
            };
        });
        Object.defineProperties(this, propDescriptors);

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

        this.$selector = {
            select: selectElement.bind(this),
            selectAll: selectElement.bind(this)
        };
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

        this.$selector = null;
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
            Object.keys(pathInfo).forEach(k => {
                this.$set(k, pathInfo[k]);
            });

            // simulate the callback execution when the set data done
            Promise.resolve().then(callback);
        }
    }
};
