/**
 * @file The component base
 * @author sparklewhy@gmail.com
 */

'use strict';

import {env, getCurrApp} from '../na/index';
import EventListener from '../util/EventListener';
import base from './base';

export default {

    /**
     * The created hook when component is created
     *
     * @private
     */
    created() {
        // cannot call setData
        Object.assign(this, base);
        this.$app = getCurrApp();

        this.$listener = new EventListener();

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

        this.$selector = env.createSelectorQuery();
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

        this.$listener.off();
        this.$selector = null;
        this.$isDestroyed = true; // add destroyed flag

        // call destroyed hook
        this.destroyed && this.destroyed();
    },

    methods: {

        /**
         * Emit custom component event
         *
         * @param {...any} args the event arguments
         */
        $emit(...args) {
            this.__beforeEmit && this.__beforeEmit(args);
            this.$listener.emit.apply(this.$listener, args);

            let triggerEvent = this.triggerEvent;
            if (triggerEvent) {
                triggerEvent.apply(this, args);
            }
        },

        /**
         * Add the handler for the given event name to listen
         *
         * @param {string} eventName the event name to listen
         * @param {Function} handler the callback to listen
         */
        $on(eventName, handler) {
            this.$listener.on(eventName, handler);
        },

        /**
         * Remove the handler for the given event name to listen.
         * If the eventName and handler are both not provided, it'll remove all event listeners.
         * If the eventName provided and the handler is not provided, it'll remove
         * the given event all listeners.
         *
         * @param {string} eventName the event name to listen
         * @param {Function} handler the callback to listen
         */
        $off(eventName, handler) {
            this.$listener.off(eventName, handler);
        },

        /**
         * Add the handler for the given event name. The handler will be only triggered
         * once, after trigger once, the listener will be automatically removed.
         *
         * @param {*} eventName the event name to listen
         * @param {*} handler the event handler
         */
        $once(eventName, handler) {
            this.$listener.once(eventName, handler);
        },

        /**
         * The template event proxy handler
         *
         * @private
         * @param {Object} event the event object
         */
        __handlerProxy(event) {
            // get event dataSet
            const data = event.currentTarget.dataset;
            const eventType = event.type;

            if ((event.target.id !== event.currentTarget.id) && data[`${eventType}ModifierSelf`]) {
                return;
            }

            const realHandler = data[`${eventType}EventProxy`];

            // get arguments in dataSet when there is real handler
            if (eventType && realHandler) {
                let args = data[`${eventType}ArgumentsProxy`] || [event];

                // passing on the event object when there is '$event' identifier
                const eventObjectAlias = data[`${eventType}EventObjectAlias`];
                if (eventObjectAlias) {
                    args = args.map(
                        item => (item === eventObjectAlias ? event : item)
                    );
                }

                // trigger real handle methods
                this[realHandler].apply(this, args);
            }
        }
    }
};
