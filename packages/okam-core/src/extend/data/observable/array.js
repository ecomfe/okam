/**
 * @file Array data update proxy
 * @author sparklewhy@gmail.com
 */

'use strict';

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

let overrideArrApis = observableArray;

/**
 * Extend the array operation methods
 *
 * @param {Object} extension the array method extension
 * @param {boolean} isOverride whether override default array extend apis,
 *        by default false, for test purpose
 */
export function extendArrayMethods(extension, isOverride) {
    /* istanbul ignore next */
    if (isOverride) {
        overrideArrApis = extension;
    }
    else {
        /* istanbul ignore next */
        Object.assign(overrideArrApis, extension);
    }
}

/**
 * Make array observable
 *
 * @param {Array} arr the array to observe
 * @param {Observer} observer the observer
 * @return {Array}
 */
export default function makeArrayObservable(arr, observer) {
    Object.keys(overrideArrApis).forEach(method => {
        let rawMethod = arr[method];
        arr[method] = overrideArrApis[method].bind(arr, observer, rawMethod);
    });

    arr.setItem = updateArrayItem.bind(arr, observer);
    arr.getItem = getArrayItem.bind(arr, observer);

    return arr;
}
