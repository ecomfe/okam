/**
 * @file Prepare for weixin app environment
 * @author sparklewhy@gmail.com
 */

/* global wx:false */
/* global getApp:false */
/* global getCurrentPages:false */
'use strict';

import {setAppEnv} from '../na/index';

setAppEnv(wx, {
    getApp,
    getCurrentPages
});
