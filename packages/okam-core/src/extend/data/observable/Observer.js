/**
 * @file Data observer
 * @author sparklewhy@gmail.com
 */

'use strict';

import {addDep, getDataSelector, addSelectorPath} from './helper';

/**
 * Update array item value
 *
 * @param {Observer} observer the observer
 * @param {number} idx the index to update
 * @param {*} value the value to set
 */
function updateArrayItem(observer, idx, value) {
    observer.set(idx, value);
    this[idx] = value;
}

/**
 * Get the array item value
 *
 * @param {Observer} observer the observer
 * @param {number} idx the index to get
 * @return {*}
 */
function getArrayItem(observer, idx) {
    return observer.get(idx);
}

/**
 * Make array observable
 *
 * @param {Array} arr the array to observe
 * @param {Observer} observer the observer
 * @param {Object} proxyArrApis the array api to proxy
 * @return {Array}
 */
function makeArrayObservable(arr, observer, proxyArrApis) {
    // Here, not using __proto__ implementation, there are two import reasons:
    // First, considering __proto__ will be deprecated and is not recommended to use
    // Second, some plugins like weixin contact plugin will change array definition,
    // the array instance __proto__ property does not contains any like `push`
    // `pop` API, and these API only existed in the instance context.
    // So, like the code as the following will not work correctly,
    // a = []; // a.__proto__.push is not defined, a.push is defined
    // a.__proto__.push = function () {};
    // a.push(2); // always call the native push, not the override push method
    // Therefor, using __proto__ to proxy the array method will not work

    Object.keys(proxyArrApis).forEach(method => {
        let rawMethod = arr[method];
        arr[method] = proxyArrApis[method].bind(arr, observer, rawMethod);
    });

    arr.setItem = updateArrayItem.bind(arr, observer);
    arr.getItem = getArrayItem.bind(arr, observer);

    return arr;
}

/**
 * Proxy the data object to observe
 *
 * @param {Observer} observer the data observer
 * @param {Object} data the data to proxy
 * @param {Object=} root the root component instance
 *        If the proxy data is root data, the root is required
 * @return {Object} the proxy object properties descriptor
 */
export function proxyObject(observer, data, root) {
    let result = {};
    let props = root && root.$rawProps;
    Object.keys(data).forEach(k => {
        // ignore props proxy
        if (props && props[k]) {
            return;
        }

        result[k] = {
            set(val) {
                observer.set(k, val);
            },

            get() {
                return observer.get(k);
            },

            enumerable: true
        };
    });

    return result;
}

/**
 * Proxy array data
 *
 * @param {Observer} observer the observer to observe array
 * @param {Array} arr the array data to proxy
 * @param {Object} proxyArrApis the array api to proxy
 * @return {Array}
 */
export function proxyArray(observer, arr, proxyArrApis) {
    let newArr = [];
    makeArrayObservable(newArr, observer, proxyArrApis);

    // XXX: copy array
    // we cannot proxy array element visited by index, so we should not proxy array element by default
    arr.forEach((item, idx) => (newArr[idx] = item));

    return newArr;
}

/**
 * The Observer class
 *
 * @class Observer
 */
export default class Observer {

    /**
     * Create observer instance
     *
     * @param {Object} ctx the component instance context
     * @param {Object} data the data to observe
     * @param {?Array.<string>} paths the observed data selector paths
     * @param {boolean=} isProps whether is the property data
     */
    constructor(ctx, data, paths, isProps = false) {
        this.isProps = isProps;
        this.ctx = ctx;
        this.rawData = data;
        this.isArray = Array.isArray(data);
        this.observableData = this.isArray ? [] : {};
        this.paths = paths || [];
        this.selector = getDataSelector(this.paths);
    }

    /**
     * Set context data
     *
     * @private
     * @param {*} value the value to set
     */
    setContextData(value) {
        let paths = this.paths;
        let result = this.ctx.data;
        let lastIdx = paths.length - 1;
        for (let i = 0; i < lastIdx; i++) {
            let p = paths[i];
            result = result[p];
        }

        /* istanbul ignore next */
        if (lastIdx >= 0) {
            result[paths[lastIdx]] = value;
        }
    }

    /**
     * Get context data
     *
     * @return {*}
     */
    getContextData() {
        let paths = this.paths;
        let result = this.ctx.data;
        for (let i = 0, len = paths.length; i < len; i++) {
            result = result[paths[i]];
        }
        return result;
    }

    /**
     * Add dependence to current target computed property
     *
     * @private
     * @param {string} k the dependence data key
     * @return {?Array.<string>} the data key access paths
     */
    addDep(k) {
        let deps = this.ctx.__deps;
        if (deps) {
            let paths = this.getPaths(k);
            addDep(deps, paths);
            return paths;
        }
    }

    /**
     * Get the data by the given field name
     *
     * @param {string} k the field name to access
     * @return {*}
     */
    get(k) {
        let ctx = this.ctx;
        let paths = this.addDep(k);
        ctx.__onDataGet && ctx.__onDataGet(paths || this.getPaths(k));

        let observeData = this.observableData;
        let value = observeData[k];
        if (value) {
            return value;
        }

        value = this.rawData[k];
        if (Array.isArray(value)) {
            paths || (paths = this.getPaths(k));
            let observer = new Observer(ctx, value, paths, this.isProps);
            let proxyApis = ctx.__proxyArrayApis;
            if (typeof proxyApis === 'function') {
                proxyApis = ctx.__proxyArrayApis = proxyApis();
            }
            return (observeData[k] = proxyArray(observer, value, proxyApis));
        }
        else if (value && typeof value === 'object') {
            paths || (paths = this.getPaths(k));
            let observer = new Observer(ctx, value, paths, this.isProps);
            return (observeData[k] = Object.defineProperties(
                {}, proxyObject(observer, value)
            ));
        }

        return value;
    }

    /**
     * Get the full data selector paths of the given field data access
     *
     * @param {string} k the field to access
     * @return {Array.<string>}
     */
    getPaths(k) {
        if (this.isArray) {
            k = +k;
        }
        let paths = this.paths;
        return [].concat(paths, k);
    }

    /**
     * Notify watcher
     *
     * @private
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
     * Set the given field new value
     *
     * @param {string} k the field to set
     * @param {*} val the new value to set
     * @param {boolean=} force whether force set, optional, by default false
     */
    set(k, val, force) {
        if (this.isProps) {
            console.warn(`property ${this.selector || k} is readonly, it's not suggested to modify it directly`);
        }

        let oldVal = k != null ? this.rawData[k] : this.rawData;
        if (k != null && val === oldVal && !force) {
            return;
        }

        let paths = k != null ? this.getPaths(k) : this.paths;
        let selector = this.selector;
        k != null && (selector = addSelectorPath(selector, k));

        if (k != null) {
            let observeData = this.observableData;
            if (observeData.hasOwnProperty(k)) {
                observeData[k] = undefined;
            }

            this.rawData[k] = val;
        }
        else {
            this.setContextData(this.rawData);
        }

        this.ctx.__setViewData({[selector]: val});
        this.notifyWatcher(val, oldVal, paths);
    }

    /**
     * Fire property value change
     *
     * @param {string} k the changed property name
     * @param {*} newVal the new value to change
     * @param {*} oldVal the old value
     */
    firePropValueChange(k, newVal, oldVal) {
        if (!this.isProps) {
            return;
        }

        let observeData = this.observableData;
        if (observeData.hasOwnProperty(k)) {
            observeData[k] = undefined;
        }
        this.notifyWatcher(newVal, oldVal, [k]);
    }
}
