/**
 * @file The app API of the h5 app
 * @author sparklewhy@gmail.com
 */

'use strict';

import selectorApi from './selector';
import systemApi from './system';
import requestApi from './request';
import routerApi from './router';
import storageApi from './storage';
import toastApi from './ui/toast';

export default Object.assign(
    selectorApi,
    systemApi,
    requestApi,
    routerApi,
    storageApi,
    toastApi
);
