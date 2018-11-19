/**
 * @file Prepare for ant app environment
 * @author sparklewhy@gmail.com
 */

/* global my:false */
/* global getApp:false */
/* global getCurrentPages:false */
'use strict';

import {setAppEnv} from '../na/index';

setAppEnv(my, {
    getApp,
    getCurrentPages
});
