/**
 * @file Add data watch support
 *       Notice: watch is dependence on the observable support
 * @author sparklewhy@gmail.com
 */

'use strict';

import {normalizeExtendProp} from '../../helper/methods';

function toDataGetter(path) {
    let parts = path.split('.');
    return function () {
        /* istanbul ignore next */
        if (typeof path !== 'string') {
            return;
        }

        let result = this;
        parts.forEach(k => {
            result = result && result[k];
        });
        return result;
    };
}

function normalizeWatchItem(key, value) {
    /* istanbul ignore next */
    if (!value) {
        return;
    }

    let handlers;
    let options = {};
    let valueType = typeof value;
    if (valueType === 'function') {
        handlers = [value];
    }
    else if (valueType === 'string') {
        handlers = [this[value]];
    }
    else if (Array.isArray(value)) {
        handlers = value;
    }
    else {
        handlers = [value.handler];
        options.immediate = value.immediate;
        options.deep = value.deep;
    }

    handlers.forEach(item => {
        /* istanbul ignore next */
        if (typeof item !== 'function') {
            console.error(`watch ${key} handler is not function`);
        }
    });

    let getter = typeof key === 'function' ? key : toDataGetter(key);
    if (options.immediate) {
        let value = getter.call(this);
        handlers.forEach(
            callback => callback.call(this, value)
        );
    }

    return {
        get: getter,
        handlers,
        options
    };
}

function normalizeWatch(watch) {
    if (!watch) {
        return;
    }

    let result = [];
    Object.keys(watch).forEach(k => {
        let watcher = normalizeWatchItem.call(this, k, watch[k]);
        watcher && (result.push(watcher));
    });
    return result;
}

export default {
    component: {

        /**
         * The instance initialization before the instance is normalized and created.
         *
         * @param {boolean} isPage whether is page component
         * @private
         */
        $init(isPage) {
            // normalize extended watch property
            normalizeExtendProp(this, 'watch', '$rawWatch', isPage);
        },

        methods: {

            /**
             * Watch the given expression or function
             *
             * @param {string|Function} expressOrFunc the expression or function to watch
             * @param {Function|Object} callback the callback to execute when the
             *        expression or function value changes
             * @param {Object=} options watch options
             * @param {boolean=} options.immediate whether trigger the callback
             *        immediately with the current value of the expression or function
             *        optional, by default false
             * @param {boolean=} optional.deep whether watch object nested value
             *        optional, by default false
             * @return {Function} the unwatch api
             */
            $watch(expressOrFunc, callback, options) {
                let watcher = normalizeWatchItem.call(
                    this, expressOrFunc,
                    Object.assign({
                        handler: callback
                    }, options)
                );
                return this.__computedObserver.addWatchComputed(watcher);
            },

            /**
             * Call after observer initialized
             *
             * @private
             */
            __afterObserverInit() {
                let watch = this.$rawWatch;
                if (typeof watch === 'function') {
                    watch = this.$rawWatch();
                }
                this.__computedObserver.addWatchComputed(
                    normalizeWatch.call(this, watch)
                );
            }
        }
    }
};
