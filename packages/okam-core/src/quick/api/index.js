/**
 * @file The native API of the quick app
 * @author sparklewhy@gmail.com
 */

'use strict';

import prompt from './prompt';
import router from './router';
import request from './request';
import platform from './platform';

export default Object.assign(
    {},
    prompt,
    router,
    request,
    platform
);
