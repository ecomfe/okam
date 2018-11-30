/**
 * @file The native API of the quick app
 * @author sparklewhy@gmail.com
 */

'use strict';

import prompt from './prompt';
import router from './router';
import request from './request';
import platform from './platform';
import * as okamAPI from '../../na/platform';

export default Object.assign(
    {
        okam: Object.assign({}, okamAPI)
    },
    prompt,
    router,
    request,
    platform
);
