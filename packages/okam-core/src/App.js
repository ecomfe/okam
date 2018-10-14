/**
 * @file Create App instance
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable fecs-export-on-declare */

import appBase from './base/application';
import {use, createApp} from './helper/factory';

/**
 * Create the app instance
 *
 * @param {Object} appInfo the appInfo
 * @return {Object}
 */
function extendApp(appInfo) {
    return createApp(appInfo, appBase);
}

extendApp.use = use;

export default extendApp;
