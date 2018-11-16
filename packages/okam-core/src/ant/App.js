/**
 * @file Create ant App instance
 * @author sparklewhy@gmail.com
 */

'use strict';

import App from '../App';
import extendApi from './api';
import {definePropertyValue} from '../util/index';
import base from '../base/base';

const baseApi = base.$api;
Object.keys(extendApi).forEach(k => {
    definePropertyValue(baseApi, k, extendApi[k]);
});

export default App;
