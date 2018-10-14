/**
 * @file event listener
 * @author sparklewhy@gmail.com
 */

'use strict';

const ALL_EVENT = '*';

/**
 * EventListener
 *
 * @class EventListener
 */
export default class EventListener {
    constructor() {
        this._listeners = {};
        this._allListeners = [];
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
        let handlerList = isAllEvent
            ? this._allListeners
            : this._listeners[eventName];
        if (!handlerList) {
            this._listeners[eventName] = handlerList = [];
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
        if (handler) {
            let handlerList = isAllEvent
                ? this._allListeners
                : this._listeners[eventName];
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
            isAllEvent
                ? (this._allListeners = [])
                : (this._listeners[eventName] = []);
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
        let handlers = this._listeners[eventName];
        if (handlers) {
            this.executeListeners(handlers, data);
        }

        this.executeListeners(this._allListeners, [eventName, ...data]);
    }

    /**
     * Dispose event listeners
     */
    dispose() {
        this._allListeners = [];
        this._listeners = {};
    }
}
