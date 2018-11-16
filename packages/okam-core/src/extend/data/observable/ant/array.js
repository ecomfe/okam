/**
 * @file Array data update proxy for ant application
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */

const componentApi = {
    __spliceData(path, spliceArgs, observer) {
        let spliceInfo = {[path]: spliceArgs};
        this.$spliceData(spliceInfo, this.__nextTickCallback);
        // update the cache raw data
        observer.rawData = observer.getContextData();
    }
};

const observableArray = {
    push(observer, rawPush, ...items) {
        let {ctx, selector} = observer;

        ctx.__spliceData(selector, [this.length, 0, ...items], observer);

        return rawPush.apply(this, items);
    },

    shift(observer, rawShift) {
        let {ctx, selector} = observer;
        if (!this.length) {
            return rawShift.call(this);
        }

        ctx.__spliceData(selector, [0, 1], observer);

        return rawShift.call(this);
    },

    unshift(observer, rawUnshift, ...items) {
        let {ctx, selector} = observer;
        ctx.__spliceData(selector, [0, 0, ...items], observer);

        return rawUnshift.apply(this, items);
    },

    pop(observer, rawPop) {
        let {ctx, selector} = observer;
        let len = this.length;
        if (!len) {
            return rawPop.call(this);
        }
        ctx.__spliceData(selector, [len - 1, 1], observer);

        return rawPop.call(this);
    },

    splice(observer, rawSplice, ...args) {
        let {ctx, selector} = observer;
        ctx.__spliceData(selector, args, observer);

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
