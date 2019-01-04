/**
 * @file Okam core exported API
 * @author sparklewhy@gmail.com
 */

'use strict';

import {
    appEnv,
    appGlobal,
    api,
    getCurrApp,
    getCurrPages
} from './na/index';
import request from './na/request';
import * as platform from './na/platform';

export {
    appEnv,
    appGlobal,
    api,
    getCurrApp,
    getCurrPages,
    request,
    platform
};
