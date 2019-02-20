/**
 * @file Computed properties observer
 * @author sparklewhy@gmail.com
 */

'use strict';

import {isWatchChange, addDep} from './helper';
import nextTick from './nextTick';

function normalizeComputedProp(value) {
    let setter;
    let getter;
    if (typeof value === 'function') {
        getter = value;
    }
    else {
        setter = value.set;
        getter = value.get;
    }

    return {setter, getter};
}

/**
 * The computed observer class
 *
 * @class ComputedObserver
 */
export default class ComputedObserver {

    /**
     * Create computed observer
     *
     * @param {Object} ctx the component instance context
     * @param {Object} computedInfo the computed definition information of the component
     */
    constructor(ctx, computedInfo) {
        this.ctx = ctx;
        this.deps = {};
        this.computed = this.initComputedProps(computedInfo);
        this.watchComputed = {};

        ctx.data || (ctx.data = {});

        let watcher = this.handleDepChange.bind(this);
        ctx.$dataListener.on('change', watcher);
        this.computedCounter = 0;
        this.notifyWatchQueues = [];
    }

    /**
     * Initialize the computed properties
     *
     * @private
     * @param {Object} computedInfo the computed information
     * @return {Object}
     */
    initComputedProps(computedInfo) {
        let computed = {};
        Object.keys(computedInfo).forEach(k => {
            computed[k] = normalizeComputedProp(computedInfo[k]);
        });

        return computed;
    }

    /**
     * Add computed properties watchers.
     * The watcher info:
     * {
     *      get: Function, // computed property getter
     *      handlers: [], // the callback of the computed property changed
     *      options: {
     *          deep: true, // whether watch in deep for the given computed property
     *      }
     * }
     *
     * @param {Array.<Object>} watchers the computed watchers
     * @return {Function} return the unwatch
     */
    addWatchComputed(watchers) {
        if (!watchers) {
            return;
        }

        if (!Array.isArray(watchers)) {
            watchers = [watchers];
        }

        let computedKeys = [];
        watchers.forEach(item => {
            let key = `__c${this.computedCounter++}`;
            computedKeys.push(key);
            this.computed[key] = normalizeComputedProp(item.get);
            this.watchComputed[key] = item;

            item.value = this.initDeps(key);
        });

        return this.removeWatchComputed.bind(this, computedKeys);
    }

    /**
     * Remove the computed watcher
     *
     * @param {Array.<string>} key the computed keys to remove
     */
    removeWatchComputed(key) {
        /* istanbul ignore next */
        if (!Array.isArray(key)) {
            key = [key];
        }

        key.forEach(k => {
            delete this.computed[k];
            delete this.watchComputed[k];
            delete this.deps[k];
        });
    }

    /**
     * Initialize the computed property values
     */
    initComputedPropValues() {
        let computedInfo = this.computed;
        let keys = computedInfo && Object.keys(computedInfo);
        if (!keys || !keys.length) {
            return;
        }

        let result = {};
        keys.forEach(k => {
            result[k] = this.initDeps(k);
        });

        this.ctx.__setViewData(result);
    }

    /**
     * Get the affected computed properties by the given change data paths.
     *
     * @private
     * @param {Array.<string>} paths the changed data paths
     * @return {Array.<string>}
     */
    getChangeComputedProps(paths) {
        let deps = this.deps;
        let found = [];
        Object.keys(deps).forEach(k => {
            let depList = deps[k] || /* istanbul ignore next */ [];
            let watchInfo = this.watchComputed[k];
            let opts = watchInfo && watchInfo.options;
            for (let i = 0, len = depList.length; i < len; i++) {
                let item = depList[i];
                if (isWatchChange(paths, item, opts)) {
                    found.push(k);
                    break;
                }
            }
        });

        return found;
    }

    /**
     * Update computed property value
     *
     * @param {string} p the computed property name to update
     * @param {Function=} shouldUpdate whether should update the computed property
     */
    updateComputed(p, shouldUpdate) {
        let ctx = this.ctx;
        let old = ctx.data[p];

        // lazy computed is not supported
        let value = this.initDeps(p);
        // maybe the computed value is a reference of the dependence data,
        // so if the old === value && typeof old === 'object', it'll also need
        // to update view
        let neeUpdate = typeof shouldUpdate === 'function'
            ? shouldUpdate(old, value, p)
            : (old !== value || (typeof old === 'object'));
        if (neeUpdate) {
            ctx.data[p] = value;
            ctx.__setViewData({[p]: value});
            this.notifyWatcher(value, old, [p]);
        }
    }

    /**
     * Execute the watch handlers
     *
     * @private
     */
    executeWatchHandlers() {
        if (this.disposed) {
            return;
        }

        this.notifyWatchQueues.forEach(({prop, old, value}) => {
            let watchInfo = this.watchComputed[prop];
            watchInfo && watchInfo.handlers.forEach(
                callback => callback.call(this.ctx, value, old)
            );
        });

        this.notifyWatchQueues = [];
        this.hasWatcherChangeTask = false;
    }

    /**
     * Add watch change info
     *
     * @private
     * @param {string} propName the changed property name
     * @param {*} old the old value
     * @param {*} value the new value
     */
    addWatchChangeInfo(propName, old, value) {
        let notifyWatchQueues = this.notifyWatchQueues;
        for (let i = 0, len = notifyWatchQueues.length; i < len; i++) {
            let item = notifyWatchQueues[i];
            if (item.prop === propName) {
                item.value = value; // update new value
                return;
            }
        }

        notifyWatchQueues.push({prop: propName, old, value});

        if (!this.hasWatcherChangeTask) {
            this.hasWatcherChangeTask = true;
            nextTick(this.executeWatchHandlers.bind(this));
        }
    }

    /**
     * Handle the change of the computed data dependence
     *
     * @private
     * @param {*} newVal the new value
     * @param {*} oldVal the old value
     * @param {Array.<string>} paths the changed data paths
     */
    handleDepChange(newVal, oldVal, paths) {
        let changeProps = this.getChangeComputedProps(paths);
        let singlePath = paths.length === 1 ? paths[0] : null;
        changeProps.forEach(p => {
            /* istanbul ignore next */
            if (p === singlePath) {
                return;
            }

            let watchInfo = this.watchComputed[p];
            if (watchInfo) {
                let old = watchInfo.value;
                let value = this.initDeps(p);
                watchInfo.value = value;

                this.addWatchChangeInfo(p, old, value);
            }
            else {
                this.updateComputed(p);
            }
        });
    }

    /**
     * Initialize the computed property dependence
     *
     * @private
     * @param {string} propName the computed property name
     * @return {*} the computed property latest value
     */
    initDeps(propName) {
        this.deps[propName] = null;

        let ctx = this.ctx;
        ctx.__ckey = propName;
        let deps = ctx.__deps = [];

        let value = this.get(propName);

        this.deps[propName] = deps;
        ctx.__deps = ctx.__ckey = null;

        return value;
    }

    /**
     * Notify watcher
     *
     * @param {*} newVal the new value
     * @param {*} oldVal the old value
     * @param {Array.<string>} paths the change data paths
     */
    notifyWatcher(newVal, oldVal, paths) {
        let ctx = this.ctx;
        ctx.__onDataSet && ctx.__onDataSet(paths, newVal, oldVal);

        let listener = ctx.$dataListener;
        listener && listener.emit('change', newVal, oldVal, paths);
    }

    /**
     * Add dependence to current target computed property
     *
     * @private
     * @param {string} k the dependence data key
     */
    addDep(k) {
        let ctx = this.ctx;
        let deps = ctx.__deps;
        /* istanbul ignore next */
        if (deps && ctx.__ckey !== k) {
            addDep(deps, [k]);
        }
    }

    /**
     * Get the data by the given computed field name
     *
     * @param {string} k the computed field name to access
     * @return {*}
     */
    get(k) {
        let ctx = this.ctx;

        let watchInfo = this.watchComputed[k];
        let value;
        if (watchInfo) {
            value = watchInfo.value;
        }
        else {
            value = ctx.data[k];
        }

        // maybe the computed prop is dependence on other computed props which
        // has not collected deps yet, we need to call getter to collect deps
        if (!this.deps[k]) {
            let getter = this.computed[k].getter;
            value = getter.call(ctx, ctx);
            // watch computed props is not view data, so don't put it to data
            watchInfo || (ctx.data[k] = value);
        }

        this.addDep(k);
        ctx.__onDataGet && ctx.__onDataGet([k]);

        return value;
    }

    /**
     * Get the computed field data getter
     *
     * @param {string} k the computed field name to access
     * @return {Function}
     */
    getGetter(k) {
        return () => this.get(k);
    }

    /**
     * Get the computed field data setter
     *
     * @param {string} k the computed field name to set
     * @return {Function}
     */
    getSetter(k) {
        return (...args) => {
            let computedInfo = this.computed[k];
            let setter = computedInfo && computedInfo.setter;
            if (setter) {
                let ctx = this.ctx;
                let oldValue = ctx.data[k];

                setter.apply(ctx, args);
                let newValue = ctx.data[k];
                this.notifyWatcher(oldValue, newValue, [k]);
            }
            else {
                throw new Error(`Computed property "${k}" was assigned to but it has no setter.`);
            }
        };
    }

    /**
     * Dispose observer
     */
    dispose() {
        this.disposed = true;
        this.notifyWatchQueues = null;
        this.deps = null;
        this.ctx = null;
        this.computed = null;
        this.watchComputed = null;
    }
}
