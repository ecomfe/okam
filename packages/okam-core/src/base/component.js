/**
 * @file The component base
 * @author sparklewhy@gmail.com
 */

'use strict';

import {env, getCurrApp} from '../na/index';
import EventListener from '../util/EventListener';
import {getApis} from '../na/api';
import base from './base';

/**
 * Normalize event arguments to fix the native swan framework bug
 *
 * @inner
 * @param {Object} args the event args to normalize
 * @return {Object}
 */
function normalizeEventArgs(args) {
    let eventData = args[1];
    if (eventData.currentTarget && eventData.target) {
        return args;
    }

    let propData = this.properties;
    let dataset = {};
    propData && Object.keys(propData).forEach(k => {
        if (/^data\w+$/.test(k)) {
            let dataKey = k.replace(
                /^data(\w)/,
                (match, char) => char.toLowerCase()
            );
            dataset[dataKey] = propData[k];
        }
    });

    let eventObj = {
        type: args[0],
        currentTarget: {
            dataset,
            id: this.id
        },
        target: {
            dataset,
            id: this.id
        },
        detail: eventData
    };
    args[1] = eventObj;

    return args;
}

/**
 * Initialize the `$refs` value
 *
 * @inner
 */
function initRefs() {
    this.$refs = {};

    let refs = this.$rawRefData;
    if (typeof refs === 'function') {
        refs = refs();
    }

    if (!refs) {
        return;
    }

    let result = {};
    let ctx;
    let self = this;
    let select = this.selectComponent;
    let isSelectComponent = false;
    if (typeof select === 'function') {
        isSelectComponent = true;
        ctx = self;
    }
    else {
        ctx = this.$selector;
        select = ctx.select;
    }

    Object.keys(refs).forEach(id => {
        result[id] = {
            get() {
                let path = `.${refs[id]}`;
                let result = select.call(ctx, path);
                if (!result && isSelectComponent) {
                    // if not custom component, try to query element info by selector API
                    result = self.$selector.select(path);
                }
                return result;
            }
        };
    });

    Object.defineProperties(this.$refs, result);
}

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
        this.$api = getApis();

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
        // init component refs
        initRefs.call(this);

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
        this.$refs = this.$selector = null;
        this.$isDestroyed = true; // add destroyed flag

        // call destroyed hook
        this.destroyed && this.destroyed();
    },

    methods: {

        /**
         * Emit custom component event
         *
         * @param  {...any} args the event arguments
         */
        $emit(...args) {
            args = normalizeEventArgs.call(this, args);
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
