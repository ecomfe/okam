/**
 * @file Array data update proxy
 * @author sparklewhy@gmail.com
 */

'use strict';

const hasProto = '__proto__' in {};

/**
 * The default override Array APIs to proxy array data update
 *
 * @type {Object}
 */
export const observableArray = {
    push(observer, rawPush, ...items) {
        let rawData = observer.rawData;
        let idx = rawData.length;

        let result = rawPush.apply(this, items);
        items.forEach(data => {
            observer.set(idx, data);
            idx++;
        });

        return result;
    },

    shift(observer, rawShift) {
        let rawData = observer.rawData;
        rawData.shift();

        let result = rawShift.call(this);
        observer.set(null, rawData);

        return result;
    },

    unshift(observer, rawUnshift, ...items) {
        let rawData = observer.rawData;
        rawData.unshift(...items);

        let result = rawUnshift.apply(this, items);
        observer.set(null, rawData);

        return result;
    },

    pop(observer, rawPop) {
        let rawData = observer.rawData;
        rawData.pop();

        let result = rawPop.call(this);
        observer.set(null, rawData);

        return result;
    },

    splice(observer, rawSplice, ...args) {
        let rawData = observer.rawData;
        rawSplice.apply(rawData, args);

        let result = rawSplice.apply(this, args);
        observer.set(null, rawData);

        return result;
    },

    sort(observer, rawSort, ...args) {
        let rawData = observer.rawData;
        rawSort.apply(rawData, args);

        let result = rawSort.apply(this, args);
        observer.set(null, rawData);

        return result;
    },

    reverse(observer, rawReverse) {
        let rawData = observer.rawData;
        rawData.reverse();

        let result = rawReverse.call(this);
        observer.set(null, rawData);

        return result;
    }
};

/**
 * The Page Array APIs to override
 *
 * @inner
 * @type {Object}
 */
let overridePageArrApis = observableArray;

/**
 * The component Array APIs to override
 *
 * @inner
 * @type {Object}
 */
let overrideComponentArrApis = observableArray;

/**
 * Extend the array operation methods
 *
 * @param {Object} arrApis the array methods to override
 * @param {boolean} isPage whether is page Array APIs to override
 */
export function overrideArrayMethods(arrApis, isPage) {
    if (isPage) {
        overridePageArrApis = arrApis;
    }
    else {
        overrideComponentArrApis = arrApis;
    }
}

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
 * @param {boolean} isPage whether is page Array APIs to override
 * @return {Array}
 */
export default function makeArrayObservable(arr, observer, isPage) {
    let arrayMethods;
    /* istanbul ignore next */
    if (hasProto) {
        arrayMethods = Object.create(Array.prototype);
        /* eslint-disable no-proto */
        arr.__proto__ = arrayMethods;
    }
    else {
        arrayMethods = arr;
    }

    let overrideArrApis = isPage ? overridePageArrApis : overrideComponentArrApis;
    Object.keys(overrideArrApis).forEach(method => {
        let rawMethod = arrayMethods[method];
        arrayMethods[method] = overrideArrApis[method].bind(arr, observer, rawMethod);
    });

    arrayMethods.setItem = updateArrayItem.bind(arr, observer);
    arrayMethods.getItem = getArrayItem.bind(arr, observer);

    return arr;
}
