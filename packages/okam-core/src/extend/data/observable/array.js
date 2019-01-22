/**
 * @file Array proxy apis
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * The default override Array APIs to proxy array data update
 *
 * @type {Object}
 */
export default {
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

        if (args.length === 3 && args[1] === 1) {
            // splice(idx, 1, newValue) is the same as arr[idx] = newValue
            let delIdx = args[0];
            let lastIdx = rawData.length - 1;
            let upIdx = delIdx > lastIdx ? (lastIdx + 1) : delIdx;
            observer.set(upIdx, args[2], true);
        }
        else {
            rawSplice.apply(rawData, args);
            observer.set(null, rawData);
        }

        return rawSplice.apply(this, args);
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
