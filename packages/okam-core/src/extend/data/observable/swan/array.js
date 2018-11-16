/**
 * @file Array data update proxy for swan application
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */

const componentApi = {
    __pushData(path, value) {
        this.pushData(path, value, this.__nextTickCallback);
    },

    __popData(path) {
        this.popData(path, this.__nextTickCallback);
    },

    __unshiftData(path, value) {
        // FIXME: native bug
        this.unshiftData(path, value, this.__nextTickCallback);
    },

    __shiftData(path) {
        this.shiftData(path, this.__nextTickCallback);
    },

    __spliceData(path, spliceArgs) {
        // FIXME: native bug
        this.spliceData(path, spliceArgs, this.__nextTickCallback);
    }
};

const observableArray = {
    push(observer, rawPush, ...items) {
        let {ctx, selector} = observer;
        items.forEach(data => ctx.__pushData(selector, data));

        // update the cache raw data
        observer.rawData = observer.getContextData();

        return rawPush.apply(this, items);
    },

    shift(observer, rawShift) {
        let {ctx, selector} = observer;
        if (!this.length) {
            return rawShift.call(this);
        }

        ctx.__shiftData(selector);

        // update the cache raw data
        observer.rawData = observer.getContextData();

        return rawShift.call(this);
    },

    unshift(observer, rawUnshift, ...items) {
        let {ctx, selector} = observer;
        ctx.__unshiftData(selector, items);

        // update the cache raw data
        observer.rawData = observer.getContextData();

        return rawUnshift.apply(this, items);
    },

    pop(observer, rawPop) {
        let {ctx, selector} = observer;
        if (!this.length) {
            return rawPop.call(this);
        }
        ctx.__popData(selector);

        // update the cache raw data
        observer.rawData = observer.getContextData();

        return rawPop.call(this);
    },

    splice(observer, rawSplice, ...args) {
        let {ctx, selector} = observer;
        ctx.__spliceData(selector, args);

        // update the cache raw data
        observer.rawData = observer.getContextData();

        return rawSplice.apply(this, args);
    }
};

Object.keys(observableArray).forEach(k => {
    let raw = observableArray[k];
    observableArray[k] = function (...args) {
        let observer = args[0];
        observer.ctx.__dataUpTaskNum++;
        let result = raw.apply(this, args);

        observer.notifyWatcher(this, this, observer.paths);

        return result;
    };
});

export {
    observableArray as array,
    componentApi as component
};
