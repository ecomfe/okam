/**
 * @file Add data watch support
 *       Notice: watch is dependence on the observable support
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-camelcase */

/**
 * Normalize watch info
 *
 * @inner
 * @param {*} value the watch info to normalize
 * @return {Object}
 */
function normalizeWatchItem(value) {
    let handlers;
    let options = {};
    let valueType = typeof value;
    if (valueType === 'function' || valueType === 'string') {
        handlers = [value];
    }
    else if (Array.isArray(value)) {
        handlers = value;
    }
    else {
        handlers = [value.handler];
        options.immediate = value.immediate;
    }

    let watchHandler = function (...args) {
        for (let i = 0, len = handlers.length; i < len; i++) {
            let item = handlers[i];
            if (typeof item === 'string') {
                item = this[item];
            }
            item.apply(this, args);
        }
    };

    return {
        handler: watchHandler,
        options
    };
}

/**
 * Create $watch callback anonymous handler name
 *
 * @inner
 * @param {number} counter the counter
 * @return {string}
 */
function createAnonymousWatcherName(counter) {
    return '__$watch_callback_' + counter;
}

/**
 * Get the available anonymous $watch callback handler name
 *
 * @inner
 * @param {Object} ctx the component instance
 * @return {string}
 */
function getAnonymousWatcherName(ctx) {
    let counter = ctx.__$watch_counter;
    if (!counter) {
        counter = ctx.__$watch_counter = 0;
    }

    let handler = createAnonymousWatcherName(counter);
    ctx.__$watch_counter = counter + 1;
    return handler;
}

/**
 * Watch the given expression or function
 *
 * @param {string|Function} expressOrFunc the expression or function to watch
 * @param {string|Function} callback the callback handler to execute when the
 *        expression or function value changes
 * @param {Object=} options watch options
 * @param {boolean=} options.immediate whether trigger the callback
 *        immediately with the current value of the expression or function
 *        optional, by default false
 * @param {boolean=} optional.deep whether watch object nested value
 *        optional, by default false
 * @return {*}
 */
function watchDataChange(expressOrFunc, callback, options) {
    if (typeof expressOrFunc === 'function') {
        expressOrFunc = this.__addComputedProp(expressOrFunc);
    }

    if (typeof callback === 'function') {
        let handlerName = getAnonymousWatcherName(this);
        this[handlerName] = callback;
        callback = handlerName;
    }

    return this.__watchDataChange(expressOrFunc, callback, options);
}

export default {
    component: {

        /**
         * The instance initialization before the instance is normalized and created.
         *
         * @param {boolean} isPage whether is page component
         * @param {Object} options the component init options
         * @private
         */
        $init(isPage, options) {
            let watch = this.watch;
            if (watch) {
                this.__userWatcher = () => watch;
                delete this.watch;

                // init anonymous watchers of the watch prop
                let innerWatchers = {};
                watch && Object.keys(watch).forEach((k, idx) => {
                    let {handler, options} = normalizeWatchItem(watch[k]);
                    let handlerName = `__watch_prop_${idx}`;
                    innerWatchers[k] = {
                        name: handlerName,
                        options
                    };
                    this[handlerName] = handler;
                });
                this.__innerWatchers = () => innerWatchers;
            }

            // init anonymous watchers of the $watch
            let {watcherCounter} = options || {};
            if (watcherCounter) {
                for (let i = 0; i < watcherCounter; i++) {
                    let watcherName = createAnonymousWatcherName(i);
                    this[watcherName] = () => {};
                }
            }
        },

        /**
         * The created hook
         *
         * @private
         */
        created() {
            this.__originalWatch = this.__originalWatch || this.$watch;
            this.$watch = watchDataChange.bind(this);
            if (typeof this.__innerWatchers === 'function') {
                let watchers = this.__innerWatchers = this.__innerWatchers();

                Object.keys(watchers).forEach(k => {
                    let {name, options} = watchers[k];
                    this.$watch(k, name, options);
                });
            }
        }
    }
};
