/**
 * @file Prepare for baidu swan app environment
 * @author sparklewhy@gmail.com
 */

/* global swan:false */
/* global getApp:false */
/* global getCurrentPages:false */
'use strict';

import {setAppEnv} from '../na/index';

setAppEnv(swan, {
    getApp,
    getCurrentPages
});
