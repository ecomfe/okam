/**
 * @file Prepare for quick app environment
 * @author sparklewhy@gmail.com
 */

/* global global:false */
'use strict';

import app from '@system.app';
import request from './request';
import {setAppEnv, setAppGlobal} from '../na/index';

setAppEnv({request}, {
    getApp: () => app
});
setAppGlobal(Object.getPrototypeOf(global) || global);
