/**
 * @file Make component support broadcast ability
 * @author sparklewhy@gmail.com
 */

'use strict';

import {appGlobal} from '../../../na/index';

const ALL_EVENT = '*';

/**
 * EventHub
 *
 * @class EventHub
 */
class EventHub {
    constructor() {
        appGlobal.okamEventHubListeners = {};
    }

    /**
     * Init event listener
     *
     * @private
     * @param {string} eventName the event name to listener
     * @param {Function} handler the handler to handle the event
     * @param {boolean=} isOnce is once listen
     */
    initEventListener(eventName, handler, isOnce = false) {
        let isAllEvent = eventName === ALL_EVENT;
        let listeners = appGlobal.okamEventHubListeners;
        let eventType = isAllEvent ? ALL_EVENT : eventName;
        let handlerList = listeners[eventType];
        if (!handlerList) {
            listeners[eventType] = handlerList = [];
        }

        /* istanbul ignore next */
        if (typeof handler === 'function') {
            handler._once = isOnce;
            handlerList.push(handler);
        }
    }

    /**
     * Listen the given event name
     *
     * @param {string} eventName the event name to listen, if wanna to listen
     *        all events, pass `*` as the event name.
     * @param {Function} handler the handler to handle event
     */
    on(eventName, handler) {
        this.initEventListener(eventName, handler);
    }

    /**
     * Listen the given event name once.
     *
     * @param {string} eventName the event name to listen
     * @param {Function} handler the handler to handle event
     */
    once(eventName, handler) {
        this.initEventListener(eventName, handler, true);
    }

    /**
     * Remove the event listener.
     * If event name and handler both not set, it'll remove all listeners.
     *
     * @param {string} eventName the event name to remove
     * @param {Function=} handler the handler to remove, if not set, it'll
     *        remove all listeners the given event name
     */
    off(eventName, handler) {
        if (!eventName && !handler) {
            this.dispose();
            return;
        }

        let isAllEvent = eventName === ALL_EVENT;
        let listeners = appGlobal.okamEventHubListeners;
        let eventType = isAllEvent ? ALL_EVENT : eventName;
        let handlerList = listeners[eventType];

        if (handler) {
            /* istanbul ignore next */
            if (handlerList) {
                let idx = handlerList.indexOf(handler);
                /* istanbul ignore next */
                if (idx !== -1) {
                    handlerList.splice(idx, 1);
                }
            }
        }
        else {
            listeners[eventType] = [];
        }
    }

    /**
     * Execute listeners
     *
     * @private
     * @param {Array} listeners the listener list
     * @param {Array} args the listener arguments
     */
    executeListeners(listeners, args) {
        let len = listeners.length;
        for (let i = 0; i < len; i++) {
            let item = listeners[i];
            item.apply(this, args);
            if (item._once) {
                listeners.splice(i, 1);
                i--;
                len--;
            }
        }
    }

    /**
     * Emit the given event
     *
     * @param {string} eventName the event name to emit
     * @param  {...any} data the event data to emit
     */
    emit(eventName, ...data) {
        let listeners = appGlobal.okamEventHubListeners;
        let handlers = listeners[eventName];

        if (handlers) {
            this.executeListeners(handlers, data);
        }

        handlers = listeners[ALL_EVENT];
        handlers && this.executeListeners(handlers, [eventName, ...data]);
    }

    /**
     * Dispose event listeners
     */
    dispose() {
        appGlobal.okamEventHubListeners = {};
    }
}

const eventCenter = new EventHub();

export default {
    app: {

        /**
         * The hook when app launch
         *
         * @private
         */
        onLaunch() {
            this.$eventHub = eventCenter;
        }
    },

    component: {

        /**
         * The hook when component created
         *
         * @private
         */
        created() {
            this.$eventHub = eventCenter;
        }
    }
};
