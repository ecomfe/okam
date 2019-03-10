/**
 * @file Util
 * @author sparklewhy@gmail.com
 */

'use strict';

function random() {
    return (((1 + Math.random()) * 0x10000) | 0)
        .toString(16).substring(1);
}

/**
 * Generate uuid
 *
 * @param {string=} prefix the uuid prefix, optional
 * @return {string}
 */
export function uuid(prefix = '') {
    return prefix + random() + random();
        // + '-' + random() + '-' + random();
        // + '-' + random() + '-' + random()
        // + random() + random();
}


/**
 * Throttle the callback execution
 *
 * @param {Function} fn the callback to execute
 * @param {number} delay the delay time
 * @param {boolean=} noTrailing whether ignore the last callback execution,
 *        optional, by default false
 * @return {Function}
 */
export function throttle(fn, delay, noTrailing) {
    let lastExecTime = 0;
    let timer = 0;

    return function (...args) {
        let context = this;
        let execute = function () {
            fn.apply(context, args);
        };

        let currTime = Date.now();
        let elapsedTime = currTime - lastExecTime;
        if (elapsedTime > delay) {
            lastExecTime = currTime;
            execute();
        }
        else if (!noTrailing) {
            timer && clearTimeout(timer);
            timer = setTimeout(execute, delay - elapsedTime);
        }
    };
}
