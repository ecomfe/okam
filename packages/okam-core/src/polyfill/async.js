/**
 * @file Polyfill for Asyn/Await support
 * @author sparklewhy@gmail.com
 */

'use strict';

import * as runtime from 'regenerator-runtime/runtime';

import {global} from '../na/index';

if (typeof regeneratorRuntime !== 'object') {
    global.regeneratorRuntime = runtime;
}

export default runtime;
