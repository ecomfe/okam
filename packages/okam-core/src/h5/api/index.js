/**
 * @file The app API of the h5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

import createSelectorQuery from './createSelectorQuery';
import systemApi from './system';
import requestApi from './request';
import routerApi from './router';

export default Object.assign(
    {
        createSelectorQuery
    },
    systemApi,
    requestApi,
    routerApi
);
