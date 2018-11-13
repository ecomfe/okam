/**
 * @file Make component support data operation like Vue
 * @author sparklewhy@gmail.com
 */

'use strict';

import {isPlainObject} from '../../../util/index';
import EventListener from '../../../util/EventListener';
import {normalizeExtendProp} from '../../../helper/methods';
import {default as Observer, proxyObject} from './Observer';
import ComputedObserver from './ComputedObserver';
import nextTick from './nextTick';
import {getSetDataPaths} from './setData';

/**
 * The component property data key
 *
 * @type {string}
 */
let propDataKey = 'data';

/**
 * Whether skip the `beforeUpdate`/`updated` hook
 *
 * @type {boolean}
 */
let isSkipUpdateHook = false;

/**
 * Make computed props observable
 *
 * @inner
 * @param {Object} ctx the component instance context
 * @return {Observer} the observer
 */
function makeComputedObservable(ctx) {
    let computedInfo = ctx.$rawComputed || {};
    if (typeof computedInfo === 'function') {
        ctx.$rawComputed = computedInfo = computedInfo();
    }

    let observer = new ComputedObserver(ctx, computedInfo);
    let ctxProps = {};
    Object.keys(computedInfo).forEach(k => {
        ctxProps[k] = {
            get: observer.getGetter(k),
            set: observer.getSetter(k),
            enumerable: true
        };
    });
    Object.defineProperties(ctx, ctxProps);
    return observer;
}

/**
 * Make props observable
 *
 * @inner
 * @param {Object} ctx the component instance context
 * @return {Observer} the observer
 */
function makePropsObservable(ctx) {
    let props = ctx.$rawProps;
    if (typeof props === 'function') {
        props = ctx.$rawProps = props();
    }

    if (!props) {
        return;
    }

    let observer = new Observer(
        ctx,
        ctx[propDataKey] || /* istanbul ignore next */ {},
        null,
        true
    );
    let propsObj = {};

    Object.keys(props).reduce((last, item) => {
        last[item] = true;
        return last;
    }, propsObj);
    Object.defineProperties(ctx, proxyObject(observer, propsObj));

    return observer;
}

/**
 * Make data observable
 *
 * @inner
 * @param {Object} ctx the component instance context
 * @return {Observer} the observer
 */
function makeDataObservable(ctx) {
    const data = ctx.data;
    if (!data) {
        return;
    }

    if (isPlainObject(data)) {
        /* eslint-disable no-use-before-define */
        let observer = new Observer(ctx, data);
        Object.defineProperties(
            ctx, proxyObject(observer, data, ctx)
        );
        return observer;
    }

    let err = new Error('data require plain object');
    err.isTypeError = true;
    throw err;
}

/**
 * Set observable context setting
 *
 * @param {string} key the prop data key
 * @param {boolean} ignoreUpdateHook whether skip update hook
 */
export function setObservableContext(key, ignoreUpdateHook) {
    propDataKey = key;
    isSkipUpdateHook = !!ignoreUpdateHook;
}

export default {
    component: {

        /**
         * Initialize the props to add observer to the prop to listen the prop change.
         *
         * @param {boolean} isPage whether is page component
         */
        $init(isPage) {
            // normalize extend computed property
            normalizeExtendProp(this, 'computed', '$rawComputed', isPage);

            // cache the raw props information because the mini program will merge data
            // and props later on.
            let props = this.props;
            if (!props) {
                return;
            }

            let rawProps = Object.assign({}, props);
            this._rawProps = rawProps;
            normalizeExtendProp(this, '_rawProps', '$rawProps', isPage);

            this.__initProps && this.__initProps();
        },

        /**
         * The created hook
         *
         * @private
         */
        created() {
            this.$waitingDataUpQueues = [];
            this.__dataUpTaskNum = 0;

            // init nextTick callback
            this.__nextTickCallback = this.$notifySetDataDone.bind(this);
            this.__executeDataUpdate = this.$executeDataUpdate.bind(this);

            this.$dataListener = new EventListener();
            if (this.$rawComputed) {
                // fix ant reference bug: `this.data.xx` operation is not allowed
                // when page onload, otherwise it'll affect the init data state
                // of the page when load next time.
                // So, here create a shadow copy of data.
                this.data = Object.assign({}, this.data);
            }

            this.__propsObserver = makePropsObservable(this);
            this.__dataObserver = makeDataObservable(this);

            let computedObserver = this.__computedObserver
                = makeComputedObservable(this);
            // init computed data
            computedObserver.initComputedPropValues();

            this.__afterObserverInit && this.__afterObserverInit();
        },

        /**
         * The detached hook
         *
         * @private
         */
        detached() {
            this.$upQueues = null;
            this.$waitingDataUpQueues = null;

            this.$dataListener.dispose();
            this.$dataListener = null;
            this.__computedObserver && this.__computedObserver.dispose();
            this.__propsObserver = this.__dataObserver = this.__computedObserver = null;
        },

        methods: {

            /**
             * Defer the callback to be executed after the next view updated cycle.
             * The callback context will be bind to the component instance
             * when executed.
             *
             * @param {Function} callback the callback to execute
             */
            $nextTick(callback) {
                let queues = this.$waitingDataUpQueues;
                if (queues) {
                    queues.push(callback);
                }
            },

            /**
             * Notify setData done
             *
             * @private
             */
            $notifySetDataDone() {
                if (this.$isDestroyed || this.__dataUpTaskNum === 0) {
                    return;
                }

                this.__dataUpTaskNum--;
                if (this.__dataUpTaskNum > 0) {
                    return;
                }

                this.__dataUpTaskNum = 0;
                let queues = this.$waitingDataUpQueues;
                /* istanbul ignore next */
                if (queues) {
                    queues.forEach(callback => callback.call(this));
                    this.$waitingDataUpQueues = [];
                }

                // call lifecycle updated hook
                isSkipUpdateHook || (this.updated && this.updated());
            },

            /**
             * Execute setData operation to update view
             *
             * @private
             */
            $executeDataUpdate() {
                if (this.$isDestroyed) {
                    return;
                }

                let queues = this.$upQueues;
                /* istanbul ignore next */
                if (queues) {
                    // TODO optimize value update: merge operations
                    // call lifecycle beforeUpdate hook
                    isSkipUpdateHook || (this.beforeUpdate && this.beforeUpdate());
                    this.setData(getSetDataPaths(queues), this.__nextTickCallback);
                    this.$upQueues = null;
                }
            },

            /**
             * Set the view data. It'll not update the view immediately, it's deferred
             * to execute when enter the next event loop.
             *
             * @private
             * @param {string|Object} obj the data to set or the path to set
             * @param {*=} value the new value to set, optional
             */
            $setData(obj, value) {
                if (typeof obj === 'string') {
                    obj = {[obj]: value};
                }

                // shadow copy the data to set
                Object.keys(obj).forEach(k => {
                    let value = obj[k];
                    if (Array.isArray(value)) {
                        value = [].concat(value);
                    }
                    else if (typeof value === 'object' && value) {
                        value = Object.assign({}, value);
                    }
                    obj[k] = value;
                });

                let queues = this.$upQueues;
                let isUpdating = !!queues;
                queues || (queues = this.$upQueues = []);
                queues.push(obj);

                if (!isUpdating) {
                    this.__dataUpTaskNum++;
                    nextTick(this.__executeDataUpdate);
                }
            }
        }
    }
};
