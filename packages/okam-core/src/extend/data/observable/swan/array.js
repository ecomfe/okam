/**
 * @file Array data update proxy for swan application
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */

const componentApi = {
    $pushData(path, value) {
        this.pushData(path, value, this.__nextTickCallback);
    },

    $popData(path) {
        this.popData(path, this.__nextTickCallback);
    },

    $unshiftData(path, value) {
        this.unshiftData(path, value, this.__nextTickCallback);
    },

    $shiftData(path) {
        this.shiftData(path, this.__nextTickCallback);
    },

    // $removeAtData(path, value) {
    //     // TODO usage of removeAtData
    //     this.removeAtData(path, value, this.__nextTickCallback);
    // },

    $spliceData(path, spliceArgs) {
        this.spliceData(path, spliceArgs, this.__nextTickCallback);
    }
};

const observableArray = {
    push(observer, rawPush, ...items) {
        let {ctx, selector} = observer;
        items.forEach(data => ctx.$pushData(selector, data));
        return rawPush.apply(this, items);
    },

    shift(observer, rawShift) {
        let {ctx, selector} = observer;
        if (!this.length) {
            return rawShift.call(this);
        }

        ctx.$shiftData(selector);

        return rawShift.call(this);
    },

    unshift(observer, rawUnshift, ...items) {
        let {ctx, selector} = observer;
        ctx.$unshiftData(selector, items);

        return rawUnshift.apply(this, items);
    },

    pop(observer, rawPop) {
        let {ctx, selector} = observer;
        if (!this.length) {
            return rawPop.call(this);
        }
        ctx.$popData(selector);

        return rawPop.call(this);
    },

    splice(observer, rawSplice, ...args) {
        let {ctx, selector} = observer;
        ctx.$spliceData(selector, args);

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
