/**
 * @file Polyfill for Asyn/Await support
 * @author sparklewhy@gmail.com
 */

'use strict';

import * as runtime from 'regenerator-runtime/runtime';
import {appGlobal} from '../na/index';

if (typeof regeneratorRuntime !== 'object') {
    appGlobal.regeneratorRuntime = runtime;
}

export default runtime;
