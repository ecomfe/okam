/**
 * @file Polyfill for Promise support
 * @author sparklewhy@gmail.com
 */

'use strict';

import PolyfillPromise from 'promise-polyfill';
import {getAppGlobal} from '../na/index';

let currPromise;
if (typeof Promise !== 'function') {
    currPromise = getAppGlobal().Promise = PolyfillPromise;
}
else {
    currPromise = Promise;
}

export default currPromise;
