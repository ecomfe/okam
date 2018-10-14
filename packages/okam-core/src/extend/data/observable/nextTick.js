/**
 * @file Simple nextTick implementation
 * @author sparklewhy@gmail.com
 */

'use strict';

export default function nextTick(callback) {
    /* istanbul ignore next */
    if (typeof Promise === 'function') {
        Promise.resolve().then(callback);
    }
    else {
        /* istanbul ignore next */
        setTimeout(callback, 0);
    }
}
