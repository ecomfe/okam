/**
 * @file Prepare for toutiao app environment
 * @author sparklewhy@gmail.com
 */

/* global tt:false */
/* global getApp:false */
/* global getCurrentPages:false */
'use strict';

import {setAppEnv} from '../na/index';

setAppEnv(tt, {
    getApp,
    getCurrentPages
});
